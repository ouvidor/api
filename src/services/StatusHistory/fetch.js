import AppError from '../../errors/AppError';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Manifestation from '../../models/Manifestation';
import Status from '../../models/Status';
import File from '../../models/File';

const fetchManifestationStatusHistory = async ({
  manifestationProtocol,
  manifestationId,
}) => {
  let manifestation = null;

  if (manifestationProtocol) {
    manifestation = await Manifestation.findOne({
      where: { protocol: manifestationProtocol },
      attributes: ['id'],
    });
  } else {
    manifestation = await Manifestation.findOne({
      where: { id: manifestationId },
      attributes: ['id'],
    });
  }

  if (!manifestation) {
    throw new AppError('Essa manfestação não existe.', 404);
  }

  const manifestationStatusHistory = await ManifestationStatusHistory.findAll({
    where: { manifestations_id: manifestation.id },
    include: [
      { model: Status, as: 'status' },
      { model: File, as: 'files' },
    ],
  });

  return manifestationStatusHistory;
};

export default fetchManifestationStatusHistory;
