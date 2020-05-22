import AppError from '../../errors/AppError';

import Ombudsman from '../../models/Ombudsman';

const updateOmbudsman = async ({
  id,
  location,
  telephone,
  email,
  site,
  attendance,
}) => {
  const ombudsman = await Ombudsman.findByPk(id);

  if (!ombudsman) {
    throw new AppError('Essa ouvidoria não existe.', 404);
  }

  if (email) {
    const emailIsAlreadyInUse = await Ombudsman.findOne({ where: { email } });

    if (emailIsAlreadyInUse) {
      throw new AppError('Já existe uma ouvidoria com esse email.', 409);
    }
  }

  const updatedOmbudsman = await ombudsman.update({
    location,
    telephone,
    email,
    site,
    attendance,
  });

  return updatedOmbudsman;
};

export default updateOmbudsman;
