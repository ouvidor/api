import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

import User from '../models/User';
import Role from '../models/Role';

// Checka se a requisição foi feita por um admin e retorna um bool
async function checkAdmin(req) {
  // pega o token do header
  const authHeader = req.headers.authorization;

  // usado para retornar no final da função
  let isAdmin = false;

  // checa se algum token foi passado
  if (!authHeader) {
    return false;
  }

  const [scheme, token] = authHeader.split(' ');

  // checa se a Header é no formato Bearer
  if (scheme !== 'Bearer') {
    return false;
  }

  const decoded = await promisify(jwt.verify)(token, authConfig.secret);

  // const userId = decoded.id;
  const userRole = decoded.role;

  userRole.forEach(role => {
    if (role.name === 'master') {
      isAdmin = true;
    }
  });

  return isAdmin;
}

class UserController {
  // Retorna todas entries de Users no DB, temporário, !somente para teste!
  async getAllUsers(req, res) {
    User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          // a linha abaixo previne que venham informações desnecessárias
          through: { attributes: [] },
        },
      ],
    })
      .then(users => {
        console.log(users);
        res.json(users);
      })
      .catch(err => console.log(err));
  }

  // salva o usuário no banco
  async saveToDb(req, res) {
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
    const isAdminMaster = await checkAdmin(req);

    const { role } = req.body;

    try {
      if (isAdminMaster && role) {
        await user.setRole(await Role.findOne({ where: { id: role } }));
      } else {
        if (role) {
          return res.json({ message: 'Você não é um admin MASTER' });
        }
        await user.setRole(await Role.findOne({ where: { name: 'citzen' } }));
      }
    } catch (error) {
      user.destroy();
      console.log(error);
    }

    return res.json(user);
  }
} // fim da classe

export default new UserController();
