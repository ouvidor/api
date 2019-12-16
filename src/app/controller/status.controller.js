import Status from '../models/Status';

class StatusController {
  // retorna todos os Status
  async fetch(req, res) {
    const status = await Status.findAll({ attributes: ['id', 'title'] });

    return res.status(200).json(status);
  }

  // retorna apenas um Status
  async show(req, res) {
    const status = await Status.findByPk(req.params.id, {
      attributes: ['id', 'title'],
    });

    if (!status) {
      return res.status(400).json({ error: 'esse status não existe' });
    }

    return res.status(200).json(status);
  }

  // salva o Status no banco
  async save(req, res) {
    const doesStatusExist = await Status.findOne({
      where: { title: req.body.title },
    });

    // caso o Status já exista
    if (doesStatusExist) {
      return res.status(400).json({ error: 'status ja existe' });
    }

    // criar Status
    const { id, title } = await Status.create(req.body);

    return res.json({
      id,
      title,
    });
  }

  // recebe um id nos parametros da rota e um title no body
  async update(req, res) {
    // busca pelo id do Status
    const status = await Status.findByPk(req.params.id);

    if (!status) {
      return res
        .status(401)
        .json({ error: 'esse status não pode ser encontrado' });
    }

    // busca apenas se receber titulo e o titulo for diferente
    if (req.body.title && req.body.title !== status.title) {
      const checkIfTitleExists = await Status.findOne({
        where: { title: req.body.title },
      });

      if (checkIfTitleExists) {
        return res
          .status(400)
          .json({ error: 'um status já existe com esse titulo' });
      }
    }
    // atualiza a instancia
    const { id, title } = await status.update(req.body);

    return res.status(200).json({ id, title });
  }

  async delete(req, res) {
    // busca pelo id do Status
    const status = await Status.findByPk(req.params.id);

    if (!status) {
      return res
        .status(401)
        .json({ error: 'esse status não pode ser encontrado' });
    }

    await status.destroy();

    return res.status(200).json(status);
  }
}

export default new StatusController();
