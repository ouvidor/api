import Category from '../models/Category';

export default [
  {
    model: Category,
    as: 'categories',
    attributes: ['id', 'title'],
    through: { attributes: [] }, // remove dados desnecessários
  },
];
