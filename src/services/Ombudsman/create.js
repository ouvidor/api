import AppError from '../../errors/AppError';

import Ombudsman from '../../models/Ombudsman';

const createOmbudsman = async ({
  location,
  telephone,
  email,
  site,
  attendance,
}) => {
  const emailIsAlreadyInUse = await Ombudsman.findOne({ where: { email } });

  if (emailIsAlreadyInUse) {
    throw new AppError('Já existe uma ouvidoria com esse email.', 409);
  }

  const ombudsman = await Ombudsman.create({
    location,
    telephone,
    email,
    site,
    attendance,
  });

  return ombudsman;
};

export default createOmbudsman;
