import jwt from 'jsonwebtoken';

import User from '../models/User';
import roles from '../data/roles';
import auth from '../../config/auth';

class AuthController {
  // Loga e retorna um Token
  async login(req, res) {
    req.password = String(req.password);

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    // caso não exista
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Checa se a senha está correta
    if (!(await user.checkPassword(req.body.password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const { id, first_name, last_name, email, role_id } = user;

    const userRole = roles.find(role => role.id === role_id);

    const token = jwt.sign({ id, role: userRole }, auth.secret, {
      expiresIn: auth.expiresIn,
    });

    return res.status(200).json({
      user: {
        id,
        first_name,
        last_name,
        email,
        role: userRole,
      },
      token,
    });
  }
} // fim da classe

export default new AuthController();
