import Type from '../models/Type';
import Category from '../models/Category';

const separateTypesAndCategories = async arrayOfTypesAndCategories => {
  const typesPromises = [];
  const categoriesPromises = [];

  for (const item of arrayOfTypesAndCategories) {
    typesPromises.push(Type.findOne({ where: { title: item } }));
    categoriesPromises.push(Category.findOne({ where: { title: item } }));
  }

  const types = await Promise.all(typesPromises);
  const categories = await Promise.all(categoriesPromises);

  const cleanedTypes = types.filter(type => type !== null);
  const cleanedCategories = categories.filter(category => category !== null);

  return { types: cleanedTypes, categories: cleanedCategories };
};

export default separateTypesAndCategories;
