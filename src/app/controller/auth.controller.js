import jwt from 'jsonwebtoken';

import User from '../models/User';
import Role from '../models/Role';
import auth from '../../config/auth';

class AuthController {
  // Loga e retorna um Tolken
  static async login(req, res) {
    req.password = String(req.password);

    const user = await User.findOne({
      where: { email: req.body.email },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'title', 'level'],
          through: { attributes: [] },
        },
      ],
    });

    // caso não exista
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Checa se a senha está correta
    if (!(await user.checkPassword(req.body.password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, first_name, last_name, email, role } = user;

    const token = jwt.sign({ id, role }, auth.secret, {
      expiresIn: auth.expiresIn,
    });

    return res.status(200).json({
      user: {
        id,
        first_name,
        last_name,
        email,
        role,
      },
      token,
    });
  }
} // fim da classe

module.exports = AuthController;
