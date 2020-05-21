import { Op } from 'sequelize';

import Category from '../../models/Category';

const doesCategoriesExists = async ids => {
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
