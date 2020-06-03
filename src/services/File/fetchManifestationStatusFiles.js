import AppError from '../../errors/AppError';
import File from '../../models/File';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';

const fetchManifestationStatusFiles = async ({ manifestationStatusId }) => {
  const manifestationStatus = await ManifestationStatusHistory.findByPk(
    manifestationStatusId
  );

  if (!manifestationStatus) {
    throw new AppError('Esse status de manifestação não existe.', 404);
  }

  const files = await File.findAll({
    where: {
      manifestations_status_id: manifestationStatusId,
    },
  });

  return files;
};

export default fetchManifestationStatusFiles;
