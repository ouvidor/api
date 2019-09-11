const Bcrypt = require('bcrypt');
const { Users } = require('../models');

class UserController {
  // Retorna todas entries de Users no DB, temporário, !somente para teste!
  static async getAllUsers(req, res) {
    console.log(Users);
    Users.findAll()
      .then(users => {
        console.log(users);
        res.sendStatus(200);
      })
      .catch(err => console.log(err));
  }

  // salva o usuário no banco
  static async saveToDb(req, res) {
    try {
      const user = new Users();
      user.name = req.body.name;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.login = req.body.login;

      // Muda a senha para o Hash
      user.password = await Bcrypt.hashSync(req.body.password, 10);

      console.log(`teste Model: ${user.name}`);
      await user.save().then(data => {
        res.json(data);
      });
    } catch (err) {
      // erro caso tente salvar uma entrada de campo unico ja existente
      if (err.name === 'SequelizeUniqueConstraintError') {
        console.log(
          `Já existe uma entrada UNICA com esse valor, campo: ${err.errors.path}`
        );

        res.send(
          `Já existe uma entrada UNICA com esse valor, campo: ${err.errors.path}`
        );
      }

      // erro geral
      res.json(err);
    }
  }
} // fim da classe

module.exports = UserController;
