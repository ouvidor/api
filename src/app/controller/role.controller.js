import Role from '../models/Role';

class RoleController {
  // Retorna todas entries de Roles no DB
  async fetchAllRoles(req, res) {
    Role.findAll()
      .then(roles => {
        console.log(roles);
        res.json(roles);
      })
      .catch(err => console.log(err));
  }

  // salva o role no banco
  async save(req, res) {
    const doesRoleExist = await Role.findOne({
      where: { title: req.body.title },
    });

    // caso o role já existir no DB
    if (doesRoleExist) {
      return res.status(400).json({ error: 'Role já cadastrado' });
    }

    // criar role
    const { id, title } = await Role.create(req.body);

    return res.json({
      id,
      title,
    });
  }
} // fim da classe

export default new RoleController();
