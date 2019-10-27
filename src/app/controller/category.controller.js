import Category from '../models/Category';

class CategoryController {
  // Retorna todas entries de Category no DB
  async fetchAll(req, res) {
    Category.findAll()
      .then(categories => {
        console.log(categories);
        res.json(categories);
      })
      .catch(err => console.log(err));
  }

  // salva a category no banco
  async save(req, res) {
    const doesCategoryExist = await Category.findOne({
      where: { name: req.body.name },
    });

    // caso a categoria já existir no DB
    if (doesCategoryExist) {
      return res.status(400).json({ error: 'categoria ja existe' });
    }

    // criar categoria
    const { id, name } = await Category.create(req.body);

    return res.json({
      id,
      name,
    });
  }
} // fim da classe

export default new CategoryController();
