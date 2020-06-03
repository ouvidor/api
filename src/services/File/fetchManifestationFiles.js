import AppError from '../../errors/AppError';
import File from '../../models/File';
import Manifestation from '../../models/Manifestation';

const fetchManifestationFiles = async ({ manifestationId }) => {
  const manifestation = await Manifestation.findOne({
    where: { id: manifestationId },
  });

  if (!manifestation) {
    throw new AppError('Manifestação não existe.', 404);
  }

  const files = await File.findAll({
    where: {
      manifestations_id: manifestationId,
    },
  });

  return files;
};

export default fetchManifestationFiles;
