import arrayOfStatus from '../data/status';

class StatusController {
  // retorna todos os Status
  async fetch(req, res) {
    return res.status(200).json(arrayOfStatus);
  }

  // retorna apenas um Status
  async show(req, res) {
    let { id } = req.params;

    id = Number(id);

    const status = arrayOfStatus.find(s => s.id === id);

    if (!status) {
      return res.status(400).json({ message: 'esse status não existe' });
    }

    return res.status(200).json(status);
  }
}

export default new StatusController();
