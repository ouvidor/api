import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

import User from '../models/User';
import roles from '../data/roles';

// Checka se a requisição foi feita por um admin e retorna um bool
async function checkAdmin(header) {
  // pega o token do header

  // usado para retornar no final da função
  let isAdmin = false;

  // checa se algum token foi passado
  if (!header) {
    return false;
  }

  const [scheme, token] = header.split(' ');

  // checa se a Header é no formato Bearer
  if (scheme !== 'Bearer') {
    return false;
  }

  const decoded = await promisify(jwt.verify)(token, authConfig.secret);

  // const userId = decoded.id;
  const userRole = decoded.role;

  if (userRole.title === 'master') {
    isAdmin = true;
  }

  return isAdmin;
}

class UserController {
  // Retorna todas entries de Users no DB, temporário, !somente para teste!
  async fetch(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'role_id'],
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: roles.find(role => role.id === user.role_id),
    }));

    return res.status(200).json(formattedUsers);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'first_name', 'last_name', 'email', 'role_id'],
    });

    if (!user) {
      return res.status(400).json({ error: 'esse usuário não existe' });
    }

    user.dataValues.role = roles.find(role => role.id === user.role_id);
    delete user.dataValues.role_id;

    return res.status(200).json(user);
  }

  // salva o usuário no banco
  async save(req, res) {
    // evitar erros caso o password seja passado como numerico
    req.body.password = String(req.body.password);

    const doesUserExist = await User.findOne({
      where: { email: req.body.email },
    });

    // caso o usuário já existir no DB
    if (doesUserExist) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // checka se possui um header e se é um adminMaster
    const isAdminMaster = await checkAdmin(req.headers.authorization);
    const { role } = req.body;
    delete req.body.role;

    const userToSave = { ...req.body };

    if (isAdminMaster && role) {
      const { id } = roles.find(r => r.title === role);
      userToSave.role_id = id;
    } else if (role) {
      return res.status(403).json({ message: 'Você não é um admin MASTER' });
    }

    // criar usuário
    const user = await User.create(userToSave);

    return res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  }

  // atualizar usuário
  async update(req, res) {
    // busca pelo id de usuário
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(401)
        .json({ error: 'essa role não pode ser encontrado' });
    }

    // checka se possui um header e se é um adminMaster
    const isAdminMaster = await checkAdmin(req.headers.authorization);
    const { role } = req.body;
    delete req.body.role;

    const updateToUser = req.body;

    if (isAdminMaster && role) {
      updateToUser.role_id = role.id;
    } else if (role) {
      return res.status(403).json({ message: 'Você não é um admin MASTER' });
    }

    if (req.body.email && req.body.email !== user.email) {
      const checkIfEmailExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (checkIfEmailExists) {
        return res
          .status(400)
          .json({ error: 'um usuário já existe com esse email' });
      }
    }

    // atualiza a instancia
    await user.update(req.body);

    const formattedUser = {
      ...user.dataValues,
      password: undefined,
      role: roles.find(r => r.id === user.id),
    };

    return res.status(200).json(formattedUser);
  }
} // fim da classe

export default new UserController();
