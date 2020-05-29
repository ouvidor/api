import AppError from '../../errors/AppError';

import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';

import getLatestManifestationStatus from '../../utils/getLatestManifestationStatus';

const cancelManifestation = async ({ id, userId }) => {
  const manifestation = await Manifestation.findByPk(id, {
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
    throw new AppError('Essa manifestação não pôde ser encontrada.', 404);
  }

  if (manifestation.users_id !== userId) {
    throw new AppError('Essa manifestação não é sua.', 401);
  }

  const latestManifestationStatus = getLatestManifestationStatus(manifestation);

  if (latestManifestationStatus.status.title !== 'cadastrada') {
    throw new AppError(
      'Fora do período disponível para cancelar a manifestação.',
      403
    );
  }

  await manifestation.destroy();
};

export default cancelManifestation;
