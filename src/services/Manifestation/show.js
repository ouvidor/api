import Manifestation from '../../models/Manifestation';

import AppError from '../../errors/AppError';
import manifestationIncludes from '../../utils/manifestationIncludes';

const showManifestation = async ({ protocol, id }) => {
  const manifestation = await Manifestation.findOne({
    attributes: {
      exclude: ['users_id', 'types_id', 'secretariats_id'],
    },
    where: {
      // decide se busca por protocolo ou id
      ...(protocol ? { protocol } : { id }),
    },
    include: manifestationIncludes,
  });

  if (!manifestation) {
    throw new AppError('Essa manifestação não existe.', 404);
  }

  return manifestation;
};

export default showManifestation;
