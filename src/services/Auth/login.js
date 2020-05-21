import jwt from 'jsonwebtoken';

import auth from '../../config/auth';
import roles from '../../data/roles';

import AppError from '../../errors/AppError';
import User from '../../models/User';
import Prefecture from '../../models/Prefecture';

const login = async ({ email, password, city }) => {
  const cityExists = await Prefecture.findOne({ where: { name: city } });

  if (!cityExists) {
    throw new AppError('Esta cidade não existe no sistema.', 400);
  }

  const user = await User.findOne({
    where: { email },
  });

  if (!user || !(await user.checkPassword(password))) {
    throw new AppError('Email ou senha incorretos', 401);
  }

  const roleExists = roles.find(r => user.role === r.title);

  if (!roleExists) {
    throw new AppError('Este cargo não existe.', 400);
  }

  const token = jwt.sign({ id: user.id, role: user.role, city }, auth.secret, {
    expiresIn: auth.expiresIn,
  });

  return { user, token, city };
};

export default login;
