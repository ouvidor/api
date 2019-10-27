import Manifestation from '../models/Manifestation';
import User from '../models/User';
import Category from '../models/Category';

class ManifestationController {
  async save(req, res) {
    // Cria a manifestação e salva no banco
    const { categories, ...data } = req.body;
    const manifestation = await Manifestation.create(data);
    await manifestation.setUser(await User.findByPk(req.user_id));

    try {
      if (categories && categories.length > 0) {
        await manifestation.setCategories(categories);
      }
    } catch (error) {
      console.log(error);
    }

    res.json(manifestation);
  }

  async fetchAll(req, res) {
    /*
     * Abaixo um exemplo com find all de como pes
     *
     */
    Manifestation.findAll({
      include: [
        {
          model: Category,
          as: 'categories',
          // a linha abaixo previne que venham informações desnecessárias
          through: { attributes: [] },
        },
      ],
    })
      .then(response => {
        console.log(response);
        res.json(response);
      })
      .catch(err => console.log(err));
  }

  async fetchById(req, res) {
    Manifestation.findOne(
      { where: { id: req.body.manifestation_id } },
      {
        include: [
          {
            model: Category,
            as: 'categories',
            // a linha abaixo previne que venham informações desnecessárias
            through: { attributes: [] },
          },
        ],
      }
    )
      .then(response => {
        console.log(response);
        res.json(response);
      })
      .catch(err => console.log(err));
  }
} // fim da classe

export default new ManifestationController();
