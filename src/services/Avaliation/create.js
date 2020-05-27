import { isAfter } from 'date-fns';

import AppError from '../../errors/AppError';

import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';
import Avaliation from '../../models/Avaliation';

import createManifestationStatus from '../StatusHistory/create';
import getLatestManifestationStatus from '../../utils/getLatestManifestationStatus';

const createAvaliation = async ({
  rate,
  description,
  reopen,
  userId,
  manifestationId,
}) => {
  const manifestation = await Manifestation.findOne({
    where: { id: manifestationId },
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

  if (!manifestation) {
    throw new AppError('Essa manifestação não existe.');
  }

  if (manifestation.users_id !== userId) {
    throw new AppError(
      'Não é permitido avaliar manifestações de outras pessoas.'
    );
  }

  /**
   * Checar se o ultimo status de manifestação é 'encerrada'
   */
  const latestManifestationStatus = getLatestManifestationStatus(manifestation);

  if (latestManifestationStatus.status.title !== 'encerrada') {
    throw new AppError(
      'A manifestação só pode ser avaliada se estiver encerrada.'
    );
  }

  const latestAvaliation = await Avaliation.findOne({
    where: { manifestations_id: manifestation.id },
    order: [['created_at', 'DESC']],
  });

  if (
    latestManifestationStatus.status.title === 'encerrada' &&
    latestAvaliation &&
    isAfter(latestAvaliation.created_at, latestManifestationStatus.created_at)
  ) {
    throw new AppError('A manifestação já foi avaliada e devidamente fechada.');
  }

  if (reopen) {
    await createManifestationStatus({
      description: 'Manifestação reaberta',
      statusIdentifier: 'cadastrada',
      manifestationId: manifestation.id,
      manifestationAlreadyChecked: true,
    });
  }

  const avaliation = await Avaliation.create({
    rate,
    description,
    manifestations_id: manifestation.id,
    reopen,
  });

  return avaliation;
};

export default createAvaliation;
