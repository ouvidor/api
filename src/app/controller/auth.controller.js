import jwt from 'jsonwebtoken';

import User from '../models/User';
import Prefecture from '../models/Prefecture';
import roles from '../data/roles';
import auth from '../../config/auth';

class AuthController {
  // Loga e retorna um Token
  async login(req, res) {
    const { email, city } = req.body;
    let { password } = req.body;
    password = String(password);

    const user = await User.findOne({
      where: { email },
    });

    // caso não exista
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Checa se a senha está correta
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const roleExists = roles.find(r => user.role === r.title);

    if (!roleExists) {
      return res.status(400).json({ error: 'Este cargo não existe.' });
    }

    const cityExists = await Prefecture.findOne({ where: { name: city } });

    if (!cityExists) {
      return res
        .status(400)
        .json({ error: 'Esta cidade não existe no sistema.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, city },
      auth.secret,
      {
        expiresIn: auth.expiresIn,
      }
    );

    return res.status(200).json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
      city,
      token,
    });
  }
} // fim da classe

export default new AuthController();
