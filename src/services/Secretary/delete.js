import AppError from '../../errors/AppError';
import Secretary from '../../models/Secretary';

const deleteSecretary = async id => {
  const secretary = await Secretary.findByPk(id);

  if (!secretary) {
    throw new AppError('Essa secretaria não pode ser encontrada.', 404);
  }

  await secretary.destroy();

  return secretary;
};

export default deleteSecretary;
