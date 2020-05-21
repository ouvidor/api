import AppError from '../../errors/AppError';
import Secretary from '../../models/Secretary';

const updateSecretary = async ({ id, email, title, accountable }) => {
  const secretary = await Secretary.findByPk(id);

  if (!secretary) {
    throw new AppError('Essa secretaria não pode ser encontrada.', 404);
  }

  // se receber um email checa se ele está em uso
  if (email && email !== secretary.email) {
    const checkIfEmailExists = await Secretary.findOne({ where: { email } });

    if (checkIfEmailExists) {
      throw new AppError('Uma secretaria já usa esse email.', 409);
    }
  }

  // se receber um title checa se ele está em uso
  if (title && title !== secretary.title) {
    const checkIfTitleExists = await Secretary.findOne({ where: { title } });

    if (checkIfTitleExists) {
      throw new AppError('Uma secretaria já existe com esse titulo.', 409);
    }
  }

  const updatedSecretary = await secretary.update({
    title,
    email,
    accountable,
  });

  return updatedSecretary;
};

export default updateSecretary;
