// const db = require('../../config/database');
import Bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import auth from '../../config/auth';

class AuthController {
  // Loga e retorna um Tolken
  static async login(req, res) {
    try {
      const user = await User.searchUserByEmail(req.body.email);

      // caso não exista
      if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado' });
      }

      // Checa se a senha está correta
      if (!(await Bcrypt.compareSync(req.body.password, user.password))) {
        return res.status(400).send({ message: 'Senha incorreta' });
      }

      const { id, first_name, last_name, email, role } = user;
      const token = jwt.sign({ id: user.id, role: user.role }, auth.secret, {
        expiresIn: auth.expiresIn,
      });
      return res.send({
        id,
        first_name,
        last_name,
        email,
        role,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: 'Senha incorreta' });
    }
  }
} // fim da classe

module.exports = AuthController;
