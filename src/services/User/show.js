import AppError from '../../errors/AppError';
import User from '../../models/User';

const showUser = async id => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
  });

  if (!user) {
    throw new AppError('Esse usuário não existe.', 404);
  }

  return user;
};

export default showUser;
