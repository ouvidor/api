import { Op } from 'sequelize';

import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';
import User from '../../models/User';
import Type from '../../models/Type';
import Category from '../../models/Category';
import Secretary from '../../models/Secretary';
import File from '../../models/File';

import separateTypesAndCategories from '../../utils/separateTypesAndCategories';

const searchManifestations = async ({
  text,
  options,
  page = 1,
  ownerId,
  isRead,
  cancelled,
  status,
}) => {
  if (options === undefined) {
    options = [];
  } else if (!Array.isArray(options)) {
    options = [options];
  }

  const { types, categories } = await separateTypesAndCategories(options);
  const typesIds = types.map(type => type.id);
  const categoriesIds = categories.map(category => category.id);

  const result = await Manifestation.findAndCountAll({
    paranoid: !cancelled, // para mostrar os cancelados paranoid deve ser false
    limit: 10,
    offset: 10 * page - 10,
    distinct: true,
    attributes: {
      exclude: ['users_id', 'types_id', 'secretariats_id'],
    },
    order: [['updated_at', 'DESC']],
    where: {
      ...(isRead && { read: isRead }),
      ...(ownerId && { users_id: ownerId }),
      /**
       * Se informar um text e types então a manifestação deverá ter ambos
       * text só é incluido se for informado
       * types_id só é incluido se for informado
       */
      [Op.and]: [
        text && { title: { [Op.like]: `%${text}%` } },
        typesIds.length > 0 && {
          types_id: {
            [Op.in]: typesIds,
          },
        },
      ],
    },
    include: [
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'title'],
        through: { attributes: [] },
        /**
         * Filtrará por categorias se for informada
         */
        where: {
          ...(categoriesIds.length > 0 && { id: { [Op.in]: categoriesIds } }),
        },
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
          exclude: ['password', 'created_at', 'updated_at'],
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
        model: File,
        as: 'files',
        attributes: ['id', 'name', 'extension'],
      },
      {
        model: ManifestationStatusHistory,
        as: 'status_history',
        attributes: ['id', 'description', 'created_at', 'updated_at'],
        include: [
          {
            model: Status,
            as: 'status',
            attributes: ['id', 'title'],
          },
        ],
      },
    ],
  });

  const last_page = Math.ceil(result.count / 10);

  return { ...result, last_page };
};

export default searchManifestations;
