import AppError from '../../errors/AppError';
import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';

const createManifestationStatusHistory = async ({
  description,
  statusIdentifier,
  manifestationId,
  manifestationAlreadyChecked = false,
}) => {
  let manifestation;
  let status;

  if (!manifestationAlreadyChecked) {
    manifestation = await Manifestation.findByPk(manifestationId, {
      attributes: ['id'],
    });

    if (!manifestation) {
      throw new AppError('Essa manifestação não existe.', 404);
    }
  }

  if (typeof statusIdentifier === 'number') {
    status = await Status.findOne({ where: { id: statusIdentifier } });
  } else {
    status = await Status.findOne({ where: { title: statusIdentifier } });
  }

  const manifestationStatus = await ManifestationStatusHistory.create({
    description,
    manifestations_id: manifestationId,
    status_id: status.id,
  });

  return manifestationStatus;
};

export default createManifestationStatusHistory;
