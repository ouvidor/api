import Category from '../models/Category';
import User from '../models/User';
import File from '../models/File';
import Type from '../models/Type';

export default [
  {
    model: File,
    as: 'files',
    attributes: ['id', 'name'],
  },
  {
    model: Type,
    as: 'type',
    attributes: ['id', 'title'],
  },
  {
    model: User,
    as: 'user',
    attributes: ['first_name', 'last_name', 'email'],
  },
  {
    model: Category,
    as: 'categories',
    attributes: ['id', 'title'],
    through: { attributes: [] }, // remove dados desnecessários
  },
];
