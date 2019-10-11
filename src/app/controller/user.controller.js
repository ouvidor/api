import User from '../models/User';
import Role from '../models/Role';

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
    let role;
    // checa se foi passado ROLE no corpo, se sim, associa a role ao usuário, se não, define citzen

    try {
      if (req.body.role) {
        await user.setRole(await Role.findByPk(req.body.role));
      } else {
        await user.setRole(await Role.findOne({ where: { name: 'citzen' } }));
      }
    } catch (error) {
      console.log(error);
    }

    return res.json(user);
  }
} // fim da classe

export default new UserController();
