import roles from '../data/roles';

class RoleController {
  // Retorna todas entries de Roles no DB
  async fetch(req, res) {
    return res.status(200).json(roles);
  }

  async show(req, res) {
    req.params.id = Number(req.params.id);

    const roleToShow = roles.find(role => {
      return role.id === req.params.id;
    });

    if (!roleToShow) {
      return res.status(400).json({ error: 'essa Role não existe' });
    }

    return res.status(200).json(roleToShow);
  }
} // fim da classe

export default new RoleController();
