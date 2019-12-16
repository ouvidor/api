import Type from '../models/Type';

class TypeController {
  // retorna todos os Type
  async fetch(req, res) {
    const type = await Type.findAll({ attributes: ['id', 'title'] });

    return res.status(200).json(type);
  }

  // retorna apenas um Type
  async show(req, res) {
    const type = await Type.findByPk(req.params.id, {
      attributes: ['id', 'title'],
    });

    if (!type) {
      return res.status(400).json({ error: 'esse tipo não existe' });
    }

    return res.status(200).json(type);
  }

  // salva o type no banco
  async save(req, res) {
    const doesTypeExist = await Type.findOne({
      where: { title: req.body.title },
    });

    // caso o type já exista
    if (doesTypeExist) {
      return res
        .status(400)
        .json({ error: 'um tipo com esse título ja existe' });
    }

    // criar type
    const { id, title } = await Type.create(req.body);

    return res.json({
      id,
      title,
    });
  }

  // recebe um id nos parametros da rota e um title no body
  async update(req, res) {
    // busca pelo id do Type
    const type = await Type.findByPk(req.params.id);

    if (!type) {
      return res
        .status(401)
        .json({ error: 'esse tipo não pode ser encontrado' });
    }

    // busca apenas se receber titulo ou se o titulo for diferente
    if (req.body.title && req.body.title !== type.title) {
      const checkIfTitleExists = await Type.findOne({
        where: { title: req.body.title },
      });

      // se existir um Type com esse titulo retorna um erro
      if (checkIfTitleExists) {
        return res
          .status(400)
          .json({ error: 'um tipo já existe com esse titulo' });
      }
    }

    // atualiza a instancia
    const { id, title } = await type.update(req.body);

    return res.status(200).json({ id, title });
  }

  async delete(req, res) {
    // busca pelo id do Type
    const type = await Type.findByPk(req.params.id);

    if (!type) {
      return res
        .status(401)
        .json({ error: 'esse tipo não pode ser encontrado' });
    }

    await type.destroy();

    return res.status(200).json(type);
  }
}

export default new TypeController();
