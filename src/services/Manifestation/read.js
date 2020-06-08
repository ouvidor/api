import AppError from '../../errors/AppError';
import Manifestation from '../../models/Manifestation';

const markManifestationAsRead = async id => {
  const manifestation = await Manifestation.findOne({ where: { id } });

  if (!manifestation) {
    throw new AppError('Essa manifestação não existe.', 404);
  }

  await manifestation.update({ read: true });

  return manifestation;
};

export default markManifestationAsRead;
