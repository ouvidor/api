import Category from '../models/Category';

class CategoryController {
  async fetch(req, res) {
    if (req.params.id) {
      const type = await Category.findByPk(req.params.id, {
        attributes: ['id', 'title'],
      });

      if (!type) {
        return res.status(400).json({ error: 'essa categoria não existe' });
      }

      return res.status(200).json(type);
    }

    const categories = await Category.findAll({ attributes: ['id', 'title'] });

    return res.status(200).json(categories);
  }

  // salva a category no banco
  async save(req, res) {
    const doesCategoryExist = await Category.findOne({
      where: { title: req.body.title },
    });

    // caso a categoria já existir no DB
    if (doesCategoryExist) {
      return res.status(400).json({ error: 'categoria ja existe' });
    }

    // criar categoria
    const { id, title } = await Category.create(req.body);

    return res.json({
      id,
      title,
    });
  }

  async update(req, res) {
    // busca pelo id do Type
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res
        .status(401)
        .json({ error: 'essa categoria não pode ser encontrado' });
    }

    // busca por uma Categoria com esse titulo passado
    const checkIfTitleExists = await Category.findOne({
      where: { title: req.body.title },
    });

    // se existir uma Categoria com esse titulo retorna um erro
    if (checkIfTitleExists) {
      return res
        .status(400)
        .json({ error: 'uma categoria já existe com esse titulo' });
    }

    // atualiza a instancia
    const { id, title } = await category.update(req.body);

    return res.status(200).json({ id, title });
  }

  async delete(req, res) {
    // busca pelo id do Category
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res
        .status(401)
        .json({ error: 'essa categoria não pode ser encontrada' });
    }

    await category.destroy();

    return res.status(200).json(category);
  }
} // fim da classe

export default new CategoryController();
