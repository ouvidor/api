import types from '../data/types';

class TypeController {
  // retorna todos os Type
  async fetch(req, res) {
    return res.status(200).json(types);
  }

  // retorna apenas um Type
  async show(req, res) {
    let { id } = req.params;
    id = Number(id);

    const type = types.find(t => t.id === id);

    if (!type) {
      return res.status(400).json({ error: 'esse tipo não existe' });
    }

    return res.status(200).json(type);
  }
}

export default new TypeController();
