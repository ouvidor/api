import AppError from '../../errors/AppError';

import Prefecture from '../../models/Prefecture';
import Ombudsman from '../../models/Ombudsman';

const createPrefecture = async ({
  name,
  location,
  telephone,
  email,
  site,
  attendance,
  ombudsmanEmail,
}) => {
  const data = {
    name,
    location,
    telephone,
    email,
    site,
    attendance,
  };

  const ombudsmanExistsPromise = Ombudsman.findOne({
    where: { email: ombudsmanEmail },
    attributes: ['id'],
  });
  const emailIsAlreadyInUsePromise = Prefecture.findOne({ where: { email } });
  const nameIsAlreadyInUsePromise = Prefecture.findOne({ where: { name } });

  const [
    emailIsAlreadyInUse,
    nameIsAlreadyInUse,
    ombudsmanExists,
  ] = await Promise.all([
    emailIsAlreadyInUsePromise,
    nameIsAlreadyInUsePromise,
    ombudsmanExistsPromise,
  ]);

  if (!ombudsmanExists) {
    throw new AppError('Essa ouvidoria não existe.', 404);
  }
  data.ombudsmen_id = ombudsmanExists.id;

  if (emailIsAlreadyInUse) {
    throw new AppError(
      'Esse email já está sendo usado por outra prefeitura.',
      409
    );
  }

  if (nameIsAlreadyInUse) {
    throw new AppError('Uma outra prefeitura já usa esse nome.', 409);
  }

  const prefecture = Prefecture.create(data);

  return prefecture;
};

export default createPrefecture;
