import AppError from '../../errors/AppError';
import Category from '../../models/Category';

const showCategory = async id => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError('Essa categoria não existe.', 404);
  }

  return category;
};

export default showCategory;
