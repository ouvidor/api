import Category from '../../models/Category';

const fetchCategories = async () => {
  const categories = await Category.findAll();

  return categories;
};

export default fetchCategories;
