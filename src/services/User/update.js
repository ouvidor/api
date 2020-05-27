import AppError from '../../errors/AppError';
import User from '../../models/User';
import checkIfMasterRole from '../../utils/checkIfMasterRole';

import roles from '../../data/roles';

const updateUser = async ({
  id,
  token,
  role,
  password,
  oldPassword,
  first_name,
  last_name,
  email,
}) => {
  const dataThatWillChange = {
    first_name,
    last_name,
    email,
    password,
  };

  // busca pelo id de usuário
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Este usuário não existe.', 404);
  }

  // checa se possui um header e se é um adminMaster
  const isAdminMaster = await checkIfMasterRole(token);

  if (role && roles.filter(r => r.title === role).length <= 0) {
    throw new AppError('Esse cargo não existe.', 404);
  }

  if (isAdminMaster && role) {
    dataThatWillChange.role = role;
  } else if (role) {
    throw new AppError(
      'Você não é um administrador mestre. Mudar o cargo não é permitido.',
      403
    );
  }

  if (email && email !== user.email) {
    const checkIfEmailExists = await User.findOne({ where: { email } });

    if (checkIfEmailExists) {
      throw new AppError('Um usuário já existe com esse email.', 409);
    }
  }

  // Checa se a senha está correta
  if (password && oldPassword) {
    if (!(await user.checkPassword(oldPassword))) {
      throw new AppError('Senha atual incorreta.', 400);
    }
  } else if (password && !oldPassword) {
    throw new AppError('Necessário informar a senha antiga.', 400);
  }

  await user.update(dataThatWillChange);

  return user;
};

export default updateUser;
