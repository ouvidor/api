import AppError from '../../errors/AppError';
import User from '../../models/User';

const searchUser = async ({ email }) => {
  if (!email) {
    throw new AppError('Email é necessário para efetuar a busca.');
  }

  const user = await User.findOne({
    attributes: {
      exclude: ['password', 'updated_at'],
    },
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError('Esse email não pertence a nenhum usuário.', 404);
  }

  return user;
};

export default searchUser;
