import AppError from '../../errors/AppError';
import Category from '../../models/Category';

const createCategory = async ({ title }) => {
  const doesCategoryExist = await Category.findOne({ where: { title } });

  if (doesCategoryExist) {
    throw new AppError('Categoria ja existe.', 409);
  }

  const category = await Category.create({ title });

  return category;
};

export default createCategory;
