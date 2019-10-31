import Role from '../models/Role';

class RoleController {
  // Retorna todas entries de Roles no DB
  async fetch(req, res) {
    const queryConfig = {
      attributes: ['id', 'title', 'level'],
    };

    if (req.params.id) {
      const role = await Role.findByPk(req.params.id, queryConfig);

      if (!role) {
        return res.status(400).json({ error: 'essa Role não existe' });
      }

      return res.status(200).json(role);
    }

    const role = await Role.findAll(queryConfig);

    return res.status(200).json(role);
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
    const { id, title, level } = await Role.create(req.body);

    return res.json({
      id,
      title,
      level,
    });
  }
} // fim da classe

export default new RoleController();
