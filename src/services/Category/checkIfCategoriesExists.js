import { Op } from 'sequelize';

import Category from '../../models/Category';

const doesCategoriesExists = async ids => {
  if (Array.isArray(ids) && ids.length === 0) {
    return false;
  }

  const categoriesExists = await Category.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });

  return categoriesExists.length === ids.length;
};

export default doesCategoriesExists;
