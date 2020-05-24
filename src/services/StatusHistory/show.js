import AppError from '../../errors/AppError';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';

const showManifestationStatus = async id => {
  const manifestationStatus = await ManifestationStatusHistory.findByPk(id, {
    include: [{ model: Status, as: 'status' }],
  });

  if (!manifestationStatus) {
    throw new AppError('Esse status de manifestação não existe.', 404);
  }

  return manifestationStatus;
};

export default showManifestationStatus;
