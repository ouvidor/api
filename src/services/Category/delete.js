import AppError from '../../errors/AppError';
import Category from '../../models/Category';

const deleteCategory = async id => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError('Essa categoria não pode ser encontrada.', 404);
  }

  await category.destroy();

  return category;
};

export default deleteCategory;
