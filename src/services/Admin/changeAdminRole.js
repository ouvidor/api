import AppError from '../../errors/AppError';
import User from '../../models/User';
import { MASTER, ADMIN, CITIZEN } from '../../data/roles';

const changeAdminRole = async ({ id, adminRole = false }) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuário não existe.', 404);
  }

  if (user.role === MASTER) {
    throw new AppError(
      'Não é permitido mudar o status do administrador master',
      403
    );
  }

  return user.update({ role: adminRole ? ADMIN : CITIZEN });
};

export default changeAdminRole;
