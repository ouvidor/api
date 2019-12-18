import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

import User from '../models/User';
import Role from '../models/Role';

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

  userRole.forEach(role => {
    if (role.title === 'master') {
      isAdmin = true;
    }
  });

  return isAdmin;
}

class UserController {
  // Retorna todas entries de Users no DB, temporário, !somente para teste!
  async fetch(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'title', 'level'],
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json(users);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'first_name', 'last_name', 'email'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'title', 'level'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ error: 'esse usuário não existe' });
    }
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

    // criar usuário
    const user = await User.create(req.body);

    // checka se possui um header e se é um adminMaster
    const isAdminMaster = await checkAdmin(req.headers.authorization);

    const { role } = req.body;
    try {
      // Se for admin master e contiver role na req seta a role
      if (isAdminMaster && role) {
        await user.setRole(await Role.findOne({ where: { title: role } }));
      } else {
        // se o if não passar, checa se role existe mesmo não sendo admin, caso sim, apaga
        // o user gravado e retorna uma mensagem
        if (role) {
          user.destroy();
          return res.json({ message: 'Você não é um admin MASTER' });
        }
        // Caso não tenha sido enviado uma role cria com a role padrão de citzen
        const roleToSet = await Role.findOne({ where: { title: 'citizen' } });
        if (roleToSet) {
          await user.setRole(roleToSet);
        } else {
          user.destroy();
          return res.json({ message: 'role invalida' });
        }
      }
    } catch (error) {
      user.destroy();
      return res.json({ error });
    }

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

    return res.status(200).json(user);
  }
} // fim da classe

export default new UserController();
