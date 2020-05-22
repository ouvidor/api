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
  ombudsmanId,
}) => {
  const data = {
    name,
    location,
    telephone,
    email,
    site,
    attendance,
  };

  if (ombudsmanId) {
    const ombudsmanExists = Ombudsman.findOne({
      where: { id: ombudsmanId },
      attributes: ['id'],
    });

    if (!ombudsmanExists) {
      throw new AppError('Essa ouvidoria não existe.', 400);
    }

    data.ombudsmen_id = ombudsmanId;
  }

  const emailIsAlreadyInUsePromise = Prefecture.findOne({ where: { email } });
  const nameIsAlreadyInUsePromise = Prefecture.findOne({ where: { name } });

  const [emailIsAlreadyInUse, nameIsAlreadyInUse] = await Promise.all([
    emailIsAlreadyInUsePromise,
    nameIsAlreadyInUsePromise,
  ]);

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
