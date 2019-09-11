// const db = require('../../config/database');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../../config/auth');

// função que gera o token
function generateToken(id) {
  const token = jwt.sign({ id }, auth.secret, {
    expiresIn: auth.expiresIn,
  });
  return token;
}

class AuthController {
  // Loga e retorna um Tolken
  static async login(req, res) {
    try {
      // procura e pega usuário do banco
      const user = await User.findOne({
        where: { login: req.body.login },
      });

      // caso não exista
      if (!user) {
        return res.status(400).send({ error: 'usuário não encontrado' });
      }

      // Checa se a senha está correta
      if (!(await Bcrypt.compareSync(req.body.password, user.password))) {
        return res.status(400).send({ message: 'Senha incorreta' });
      }

      user.password = undefined;
      return res.send({ user, token: generateToken(user.id) });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: 'Senha incorreta' });
    }
  }
} // fim da classe

module.exports = AuthController;
