import User from '../models/User';

class UserController {
  // Retorna todas entries de Users no DB, temporário, !somente para teste!
  async getAllUsers(req, res) {
    User.findAll()
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
    const { id, email, name } = await User.create({
      email: req.body.email,
      name: req.body.name,
      passwordTemp: req.body.password,
    });

    return res.json({
      id,
      name,
      email,
    });
  }
} // fim da classe

export default new UserController();
