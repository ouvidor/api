import { extname } from 'path';

import GoogleCloudStorage from '../../lib/GoogleCloudStorage';
import AppError from '../../errors/AppError';
import File from '../../models/File';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import User from '../../models/User';

import deleteTempFiles from '../../utils/deleteTempFiles';

const saveManifestationStatusFiles = async ({
  userId,
  manifestationStatusId,
  files,
  userRoleId,
}) => {
  if (!files) {
    throw new AppError('Não consta um arquivo na requisição.', 400);
  }

  const isUserAnAdmin = userRoleId > 1;

  if (!isUserAnAdmin) {
    throw new AppError(
      'Não tem permissão para enviar um arquivo para essa manifestação.',
      403
    );
  }

  const userPromise = User.findByPk(userId); // usuario que fez a requisição de upload
  const manifestationStatusPromise = ManifestationStatusHistory.findByPk(
    manifestationStatusId,
    {
      attributes: ['id'],
    }
  );

  const [user, manifestationStatus] = await Promise.all([
    userPromise,
    manifestationStatusPromise,
  ]);

  if (!manifestationStatus || !user) {
    deleteTempFiles(files);

    if (!manifestationStatus) {
      throw new AppError('Esse status de manifestação não existe.', 404);
    }

    throw new AppError('Usuario não existe.', 404);
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
      manifestations_status_id: manifestationStatus.id,
      users_id: user.id,
    }));

    const savedFiles = await File.bulkCreate(formattedFiles);

    deleteTempFiles(files);

    return savedFiles;
  } catch (error) {
    deleteTempFiles(files);
    files.forEach(file => GoogleCloudStorage.delete(file.filename));

    throw new AppError('Erro ao salvar arquivos no servidor.', 500);
  }
};

export default saveManifestationStatusFiles;
