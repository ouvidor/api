import AppError from '../../errors/AppError';

import Prefecture from '../../models/Prefecture';
import Ombudsman from '../../models/Ombudsman';

const updatePrefecture = async ({
  idToSearch,
  nameToSearch,
  name,
  location,
  telephone,
  email,
  site,
  attendance,
  ombudsmanId,
}) => {
  const prefecture = await Prefecture.findOne({
    where: {
      ...(nameToSearch ? { name: nameToSearch } : { id: idToSearch }),
    },
    include: [{ model: Ombudsman, as: 'ombudsman' }],
  });

  if (!prefecture) {
    throw new AppError('Essa prefeitura não existe.', 404);
  }

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

  let emailIsAlreadyInUsePromise;
  let nameIsAlreadyInUsePromise;

  if (email) {
    emailIsAlreadyInUsePromise = Prefecture.findOne({ where: { email } });
  }

  if (name) {
    nameIsAlreadyInUsePromise = Prefecture.findOne({ where: { name } });
  }

  const [emailIsAlreadyInUse, nameIsAlreadyInUse] = await Promise.all([
    emailIsAlreadyInUsePromise,
    nameIsAlreadyInUsePromise,
  ]);

  if (emailIsAlreadyInUse && emailIsAlreadyInUse.id !== prefecture.id) {
    throw new AppError(
      'Esse email já está sendo usado por outra prefeitura.',
      409
    );
  }

  if (nameIsAlreadyInUse && nameIsAlreadyInUse.id !== prefecture.id) {
    throw new AppError('Uma outra prefeitura já usa esse nome.', 409);
  }

  const updatedPrefecture = await prefecture.update(data);

  return updatedPrefecture;
};

export default updatePrefecture;
