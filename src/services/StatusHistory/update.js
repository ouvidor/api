import AppError from '../../errors/AppError';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';

const updateManifestationStatus = async ({
  statusHistoryId,
  description,
  statusId,
}) => {
  const manifestationStatus = await ManifestationStatusHistory.findByPk(
    statusHistoryId,
    {
      include: [{ model: Status, as: 'status' }],
    }
  );

  if (!manifestationStatus) {
    throw new AppError('Esse status de manifestação não existe.', 404);
  }

  const updatedManifestationStatus = await manifestationStatus.update({
    description,
    status_id: statusId,
  });

  return updatedManifestationStatus;
};

export default updateManifestationStatus;
