import Category from '../models/Category';
import Type from '../models/Type';
import File from '../models/File';

export default [
  {
    model: Category,
    as: 'categories',
    attributes: ['id', 'title'],
    through: { attributes: [] }, // remove dados desnecessários
  },
  {
    model: Type,
    as: 'type',
    attributes: ['id', 'title'],
  },
];
