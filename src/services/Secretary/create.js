import AppError from '../../errors/AppError';
import Secretary from '../../models/Secretary';
import Prefecture from '../../models/Prefecture';

const createSecretary = async ({ title, email, city, accountable }) => {
  const doesEmailExistsPromise = Secretary.findOne({
    where: { email },
  });

  const doesSecretaryExistsPromise = Secretary.findOne({
    where: { title },
  });

  const prefecturePromise = Prefecture.findOne({ where: { name: city } });

  const [doesEmailExists, doesSecretaryExists, prefecture] = await Promise.all([
    doesEmailExistsPromise,
    doesSecretaryExistsPromise,
    prefecturePromise,
  ]);

  // caso o email já esteja em uso
  if (doesEmailExists) {
    throw new AppError('Uma outra secretaria já usa esse email.', 409);
  }

  // caso o titulo já esteja em uso
  if (doesSecretaryExists) {
    throw new AppError('Essa secretaria ja existe.', 409);
  }

  if (!prefecture) {
    throw new AppError('Essa prefeitura não existe.');
  }

  // criar Secretary
  const secretary = await Secretary.create({
    email,
    title,
    prefectures_id: prefecture.id,
    accountable,
  });

  return secretary;
};

export default createSecretary;
