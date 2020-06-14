import Category from '../models/Category';
import User from '../models/User';
import File from '../models/File';
import Type from '../models/Type';
import Status from '../models/Status';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';
import Secretary from '../models/Secretary';

export default [
  {
    model: File,
    as: 'files',
    attributes: [
      'id',
      'name',
      'extension',
      'manifestations_id',
      'manifestations_status_id',
    ],
  },
  {
    model: Type,
    as: 'type',
    attributes: ['id', 'title'],
  },
  {
    model: User,
    as: 'user',
    attributes: {
      exclude: ['password', 'created_at', 'updated_at', 'deleted_at'],
    },
  },
  {
    model: Secretary,
    as: 'secretary',
    attributes: {
      exclude: ['created_at', 'updated_at'],
    },
  },
  {
    model: ManifestationStatusHistory,
    as: 'status_history',
    attributes: ['id', 'description', 'created_at', 'updated_at'],
    include: [
      {
        model: File,
        as: 'files',
      },
      {
        model: Status,
        as: 'status',
        attributes: ['id', 'title'],
      },
    ],
  },
  {
    model: Category,
    as: 'categories',
    attributes: ['id', 'title'],
    through: { attributes: [] }, // remove dados desnecessários
  },
];
