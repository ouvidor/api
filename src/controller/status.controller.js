import Status from '../models/Status';

class StatusController {
  // retorna todos os Status
  async fetch(req, res) {
    const status = await Status.findAll();

    return res.status(200).json(status);
  }

  // retorna apenas um Status
  async show(req, res) {
    let { id } = req.params;

    id = Number(id);

    const status = await Status.findOne({
      where: {
        id,
      },
    });

    if (!status) {
      return res.status(400).json({ message: 'Esse status não existe.' });
    }

    return res.status(200).json(status);
  }
}

export default new StatusController();
