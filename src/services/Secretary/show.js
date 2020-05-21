import AppError from '../../errors/AppError';
import Secretary from '../../models/Secretary';

const showSecretary = async id => {
  const secretary = await Secretary.findByPk(id, {
    attributes: { exclude: ['created_at', 'updated_at'] },
  });

  if (!secretary) {
    throw new AppError('Essa secretaria não existe.', 404);
  }

  return secretary;
};

export default showSecretary;
