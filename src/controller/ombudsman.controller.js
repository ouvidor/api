import Ombudsman from '../models/Ombudsman';

class OmbudsmanController {
  async fetch(req, res) {
    const ombudsmen = await Ombudsman.findAll();

    if (!ombudsmen) {
      return res.status(204).send();
    }

    return res.status(200).json(ombudsmen);
  }

  async show(req, res) {
    const { id } = req.params;

    const ombudsman = await Ombudsman.findOne({
      where: { id },
    });

    if (!ombudsman) {
      return res.status(204).send();
    }

    return res.status(200).json(ombudsman);
  }

  async update(req, res) {
    const { id } = req.params;

    const ombudsman = await Ombudsman.findOne({
      where: { id },
    });

    if (!ombudsman) {
      return res.status(500).json({
        error: 'Não há uma ouvidoria cadastrada! Informe o suporte!',
      });
    }

    const updatedOmbudsman = await ombudsman.update(req.body);

    return res.status(200).json(updatedOmbudsman);
  }
}

export default new OmbudsmanController();
