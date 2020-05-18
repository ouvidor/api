import Prefecture from '../models/Prefecture';
import Ombudsman from '../models/Ombudsman';

class PrefectureController {
  async fetch(req, res) {
    const prefectures = await Prefecture.findAll({
      include: [{ model: Ombudsman, as: 'ombudsman' }],
    });

    if (!prefectures) {
      return res.status(204).send();
    }

    return res.status(200).json(prefectures);
  }

  async show(req, res) {
    const { id } = req.params;
    let cityName;

    if (isNaN(id)) {
      cityName = id;
    }

    const prefecture = await Prefecture.findOne({
      where: {
        ...(cityName ? { name: cityName } : { id }),
      },
      include: [{ model: Ombudsman, as: 'ombudsman' }],
    });

    if (!prefecture) {
      return res.status(204).send();
    }

    return res.status(200).json(prefecture);
  }

  async update(req, res) {
    const { id } = req.params;

    const prefecture = await Prefecture.findOne({
      where: { id },
    });

    if (!prefecture) {
      return res.status(500).json({
        error: 'Não há uma prefeitura cadastrada! Informe o suporte!',
      });
    }

    const updatedPrefecture = await prefecture.update(req.body);

    return res.status(200).json(updatedPrefecture);
  }
}

export default new PrefectureController();
