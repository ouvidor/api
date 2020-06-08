import AppError from '../../errors/AppError';
import Manifestation from '../../models/Manifestation';
import Secretary from '../../models/Secretary';

const linkSecretaryToManifestation = async ({
  manifestationId,
  secretaryId,
}) => {
  const manifestationPromise = Manifestation.findByPk(manifestationId, {
    attributes: ['id'],
  });
  const secretaryPromise = Secretary.findByPk(secretaryId, {
    attributes: ['id'],
  });

  const [manifestation, secretary] = await Promise.all([
    manifestationPromise,
    secretaryPromise,
  ]);

  if (!manifestation) {
    throw new AppError('Essa manifestação não existe.', 404);
  }

  if (!secretary) {
    throw new AppError('Essa secretaria não existe.', 404);
  }

  await manifestation.update({
    secretariats_id: secretary.id,
  });
};

export default linkSecretaryToManifestation;
