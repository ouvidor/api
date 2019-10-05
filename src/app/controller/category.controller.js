import Category from '../models/Category';

class CategoryController {
  // Retorna todas entries de Users no DB, temporário, !somente para teste!
  async getAllCategories(req, res) {
    Category.findAll()
      .then(categories => {
        console.log(categories);
        res.json(categories);
      })
      .catch(err => console.log(err));
  }

  // salva a category no banco
  async saveToDb(req, res) {
    const doesUserExist = await Category.findOne({
      where: { name: req.body.name },
    });

    // caso a categoria já existir no DB
    if (doesUserExist) {
      return res.status(400).json({ error: 'Ususário já existe' });
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
