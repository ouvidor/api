import Manifestation from '../models/Manifestation';
import Category from '../models/Category';

class ManifestationController {
  async save(req, res) {
    // Cria a manifestação e salva no banco
    const { categories, ...data } = req.body;

    let manifestation;

    try {
      manifestation = await Manifestation.create({
        ...data,
        user_id: req.user_id,
      });
    } catch (error) {
      // é possivel que ocorra um erro se o token estiver invalido
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    // adicionar as categorias
    try {
      if (categories && categories.length > 0) {
        await manifestation.setCategories(categories);
      }
    } catch (error) {
      manifestation.destroy();
      console.log(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    return res.status(200).json(manifestation);
  }

  async fetch(req, res) {
    if (req.params.id) {
      const manifestation = await Manifestation.findByPk(req.params.id);

      if (!manifestation) {
        return res.status(400).json({ error: 'essa manifestação não existe' });
      }

      return res.status(200).json(manifestation);
    }

    const manifestations = await Manifestation.findAll({
      include: [
        {
          model: Category,
          as: 'categories',
          // só pega o id e o título
          attributes: ['id', 'title'],
          // a linha abaixo previne que venham informações desnecessárias
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json(manifestations);
  }
} // fim da classe

export default new ManifestationController();
