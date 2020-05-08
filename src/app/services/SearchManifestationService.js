import { Op } from 'sequelize';

import Manifestation from '../models/Manifestation';
import Category from '../models/Category';
import User from '../models/User';
import Secretary from '../models/Secretary';
import File from '../models/File';
import Type from '../models/Type';
import Status from '../models/Status';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';

class SearchManifestationService {
  async fetchOptionsIds(options) {
    let types = [];
    let categories = [];

    // se não for um array, vira um array
    if (typeof options !== 'object') {
      // um array com apenas uma opção
      options = [options];
    }

    // coloca promises nos arrays
    for (const option of options) {
      const type = Type.findOne({ where: { title: option } });
      if (type) {
        types.push(type);
      }

      const category = Category.findOne({ where: { title: option } });
      if (category) {
        categories.push(category);
      }
    }

    // resolve todas as promises depois de acabar
    types = await Promise.all(types);
    categories = await Promise.all(categories);

    const filteredTypes = types.filter(type => type !== null);
    const filteredCategories = categories.filter(category => category !== null);

    return [filteredTypes, filteredCategories];
  }

  makeWhereQuery(text, types, categories, page, isRead, ownerId) {
    const query = {
      distinct: true,
      attributes: {
        exclude: ['users_id', 'types_id', 'secretariats_id'],
      },
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'title'],
          // a linha abaixo previne que venham informações desnecessárias
          through: { attributes: [] },
          where: {
            id: {
              [Op.or]: categories,
            },
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
      where: {
        ...(isRead && { read: isRead }),
        ...(ownerId && { users_id: ownerId }),
        [Op.and]: [
          text && { title: { [Op.like]: `%${text}%` } },
          {
            types_id: {
              [Op.or]: types,
            },
          },
        ],
      },
      limit: 10,
      offset: 10 * page - 10,
    };

    return query;
  }

  async run(text, options, page = 1, isRead, ownerId) {
    let types = [];
    let categories = [];

    if (options) {
      [types, categories] = await this.fetchOptionsIds(options);
    }

    const typesIds = types.map(type => type.id);
    const categoriesIds = categories.map(category => category.id);

    const query = this.makeWhereQuery(
      text,
      typesIds,
      categoriesIds,
      page,
      isRead,
      ownerId
    );

    const manifestations = await Manifestation.findAndCountAll(query);

    // retorna qual a ultima página
    manifestations.last_page = Math.ceil(manifestations.count / 10);

    return manifestations;
  }
}

export default new SearchManifestationService();
