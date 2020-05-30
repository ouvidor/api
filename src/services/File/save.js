import { extname } from 'path';

import GoogleCloudStorage from '../../lib/GoogleCloudStorage';
import AppError from '../../errors/AppError';
import File from '../../models/File';
import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';
import User from '../../models/User';
import createManifestationStatus from '../StatusHistory/create';

import checkIfManifestionInUpdatePeriod from '../../utils/checkIfManifestionInUpdatePeriod';
import deleteTempFiles from '../../utils/deleteTempFiles';
import getLatestManifestationStatus from '../../utils/getLatestManifestationStatus';

const saveFiles = async ({ userId, manifestationId, files, userRoleId }) => {
  const userPromise = User.findByPk(userId); // usuario que fez a requisição de upload
  const manifestationPromise = Manifestation.findByPk(manifestationId, {
    include: [
      {
        model: ManifestationStatusHistory,
        as: 'status_history',
        attributes: ['id', 'description', 'created_at', 'updated_at'],
        include: [
          {
            model: Status,
            as: 'status',
            attributes: ['id', 'title'],
          },
        ],
      },
    ],
  });

  const [user, manifestation] = await Promise.all([
    userPromise,
    manifestationPromise,
  ]);

  const latestManifestationStatus = getLatestManifestationStatus(manifestation);

  if (!checkIfManifestionInUpdatePeriod(latestManifestationStatus)) {
    deleteTempFiles(files);
    throw new AppError(
      'Fora do período disponível para edição da manifestação.'
    );
  }

  if (!files) {
    throw new AppError('Não consta um arquivo na requisição.', 400);
  }

  if (!manifestation || !user) {
    deleteTempFiles(files);

    if (!manifestation) {
      throw new AppError('Manifestação não existe.', 404);
    }

    throw new AppError('Usuario não existe.', 404);
  }

  const isOwner = user.id === manifestation.users_id;
  const isUserAnAdmin = userRoleId > 1;

  /**
   * O usuário deve ser dono da manifestação
   * OU
   * O usuário deve ser um administrador
   */
  if (!isOwner && !isUserAnAdmin) {
    throw new AppError(
      'Não tem permissão para enviar um arquivo para essa manifestação.',
      403
    );
  }

  const uploadPromises = files.map(file =>
    GoogleCloudStorage.upload(file.filename)
  );

  await Promise.all(uploadPromises).catch(() => {
    throw new AppError('Erro no envio de arquivos.', 503);
  });

  // Já que o upload dos arquivos foi um sucesso ele salva os dados no banco
  try {
    const formattedFiles = files.map(file => ({
      extension: extname(file.originalname),
      name: file.originalname,
      name_in_server: file.filename,
    }));

    const savedFiles = await File.bulkCreate(formattedFiles);
    savedFiles.forEach(async file => {
      await file.setUser(user);
      await file.setManifestation(manifestation);
    });

    deleteTempFiles(files);

    // se for o dono da manifestação marca como complementada
    if (
      userId === manifestation.users_id &&
      latestManifestationStatus.status.title !== 'complementada'
    ) {
      await createManifestationStatus({
        description: 'Manifestação foi complementada',
        manifestationId: manifestation.id,
        statusIdentifier: 'complementada',
        manifestationAlreadyChecked: true,
      });
    }

    return savedFiles;
  } catch (error) {
    deleteTempFiles(files);
    files.forEach(file => GoogleCloudStorage.delete(file.filename));

    throw new AppError('Erro ao salvar arquivos no servidor.', 500);
  }
};

export default saveFiles;
