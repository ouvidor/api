import Type from '../models/Type';

class TypeController {
  // retorna todos os Type
  async fetch(req, res) {
    const types = await Type.findAll();

    return res.status(200).json(types);
  }

  // retorna apenas um Type
  async show(req, res) {
    let { id } = req.params;
    id = Number(id);

    const type = await Type.findOne({
      where: {
        id,
      },
    });

    if (!type) {
      return res.status(400).json({ error: 'Esse tipo não existe.' });
    }

    return res.status(200).json(type);
  }
}

export default new TypeController();
