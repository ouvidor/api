import AppError from '../../errors/AppError';

import Ombudsman from '../../models/Ombudsman';

const showOmbudsman = async id => {
  const ombudsman = await Ombudsman.findByPk(id);

  if (!ombudsman) {
    throw new AppError('Essa ouvidoria não existe.', 404);
  }

  return ombudsman;
};

export default showOmbudsman;
