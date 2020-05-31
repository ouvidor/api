import AppError from '../../errors/AppError';
import User from '../../models/User';
import { ADMIN, CITIZEN } from '../../data/roles';

const changeAdminRole = async ({ id, adminRole = false }) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw AppError('Usuário não existe.', 404);
  }

  return user.update({ role: adminRole ? ADMIN : CITIZEN });
};

export default changeAdminRole;
