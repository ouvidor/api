import AppError from '../../errors/AppError';
import User from '../../models/User';

const deleteUser = async ({ id, userId }) => {
  const user = await User.findByPk(id);

  if (user.id !== userId) {
    throw new AppError('Esse não é seu perfil.', 403);
  }

  await user.destroy();
};

export default deleteUser;
