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

  async update(req, res) {
    // busca pelo id do Status
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res
        .status(401)
        .json({ error: 'essa role não pode ser encontrado' });
    }

    // busca apenas se receber titulo e o titulo for diferente
    if (req.body.title && req.body.title !== role.title) {
      const checkIfTitleExists = await Role.findOne({
        where: { title: req.body.title },
      });

      if (checkIfTitleExists) {
        return res
          .status(400)
          .json({ error: 'um status já existe com esse titulo' });
      }
    }

    // atualiza a instancia
    const { id, title, level } = await role.update(req.body);

    return res.status(200).json({ id, title, level });
  }

  async delete(req, res) {
    // busca pelo id do Status
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res
        .status(401)
        .json({ error: 'essa role não pode ser encontrado' });
    }

    if (role.level) {
      // busca se existe uma outra role desse nível
      const rolesWithThisLevel = await Role.findAll({
        where: { level: role.level },
      });

      // não exclui a unica role desse nível
      if (rolesWithThisLevel.length === 1) {
        return res
          .status(400)
          .json({ error: 'não é possivel excluir a unica role desse nível' });
      }
    }

    await role.destroy();

    return res.status(200).json(role);
  }
} // fim da classe

export default new RoleController();
