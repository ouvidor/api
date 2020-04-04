import Prefecture from '../models/Prefecture';

class OmbudsmanController {
  async fetch(req, res) {
    const [prefecture] = await Prefecture.findAll();

    if (!prefecture) {
      return res.status(204).send();
    }

    return res.status(200).json(prefecture);
  }

  async update(req, res) {
    const [prefecture] = await Prefecture.findAll();

    if (!prefecture) {
      return res.status(500).json({
        error: 'Não há uma prefeitura cadastrada! Informe o suporte!',
      });
    }

    const updatedPrefecture = await prefecture.update(req.body);

    return res.status(200).json(updatedPrefecture);
  }
}

export default new OmbudsmanController();
