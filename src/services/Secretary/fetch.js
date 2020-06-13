import AppError from '../../errors/AppError';
import Prefecture from '../../models/Prefecture';
import Secretary from '../../models/Secretary';

const fetchSecretariats = async ({ city }) => {
  const prefecture = await Prefecture.findOne({ where: { name: city } });

  if (!prefecture) {
    throw new AppError(
      'Essa cidade não existe, tente relogar no sistema.',
      404
    );
  }

  const secretariats = await Secretary.findAll({
    where: { prefectures_id: prefecture.id },
    attributes: { exclude: ['created_at', 'updated_at'] },
  });

  return secretariats;
};

export default fetchSecretariats;
