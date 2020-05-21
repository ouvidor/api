import AppError from '../../errors/AppError';
import Category from '../../models/Category';

const updateCategory = async ({ id, title }) => {
  const categoryPromise = Category.findByPk(id);
  const checkIfTitleIsUsedPromise = Category.findOne({
    where: { title },
  });

  const [category, checkIfTitleIsUsed] = await Promise.all([
    categoryPromise,
    checkIfTitleIsUsedPromise,
  ]);

  if (!category) {
    throw new AppError('Essa categoria não pôde ser encontrada.', 404);
  }

  if (checkIfTitleIsUsed) {
    throw new AppError('Uma categoria já existe com esse titulo.', 409);
  }

  const updatedCategory = await category.update({ title });

  return updatedCategory;
};

export default updateCategory;
