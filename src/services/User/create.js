import roles from '../../data/roles';
import AppError from '../../errors/AppError';
import User from '../../models/User';
import checkIfMasterRole from '../../utils/checkIfMasterRole';

const createUser = async ({
  first_name,
  last_name,
  email,
  password,
  role,
  token,
}) => {
  const doesUserExist = await User.findOne({
    where: { email },
  });

  // caso o usuário já existir no DB
  if (doesUserExist) {
    throw new AppError('Este email já está cadastrado.', 409);
  }

  // checka se possui um header e se é um adminMaster
  const isAdminMaster = await checkIfMasterRole(token);

  const userToSave = { first_name, last_name, email, password };

  if (role && roles.filter(r => r.title === role).length <= 0) {
    throw new AppError('Esse cargo não existe.', 404);
  }

  if (isAdminMaster && role) {
    userToSave.role = role;
  } else if (role) {
    throw new AppError(
      'Você não é um administrador mestre. Registrar com esse cargo não é permitido.',
      403
    );
  }

  // criar usuário
  const user = await User.create(userToSave);

  return user;
};

export default createUser;
