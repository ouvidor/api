import Category from '../models/Category';
import User from '../models/User';
import File from '../models/File';

export default [
  {
    model: File,
    as: 'files',
    attributes: ['id', 'file_name'],
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
