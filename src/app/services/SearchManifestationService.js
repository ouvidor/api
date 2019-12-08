import { Op } from 'sequelize';

import Manifestation from '../models/Manifestation';
import Type from '../models/Type';
import Category from '../models/Category';

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

      const category = Category.findOne({
        where: { title: option },
      });
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

  checkIfProtocol(text) {
    if (!text.match(/\d*-\d/)) return false;

    return true;
  }

  makeWhereQuery(text, types, categories, page, isRead, isProtocol) {
    let textSearch;

    if (text) {
      if (isProtocol) {
        // define busca por protocolo
        textSearch = { protocol: text };
      } else {
        // define busca por título
        textSearch = {
          title: { [Op.like]: `%${text}%` },
        };
      }
    }

    const query = {
      include: [
        {
          model: Category,
          as: 'categories',
          // só pega o id e o título
          attributes: ['id', 'title'],
          // a linha abaixo previne que venham informações desnecessárias
          through: { attributes: [] },
          where: {
            [Op.and]: [
              categories.length > 0
                ? {
                    id: {
                      [Op.or]: [...categories],
                    },
                  }
                : undefined,
            ],
          },
        },
        {
          model: Type,
          as: 'type',
          attributes: ['id', 'title'],
        },
      ],
      where: {
        ...(!isRead && { read: 0 }),
        [Op.and]: [
          textSearch,
          types.length > 0
            ? {
                type_id: {
                  [Op.or]: [...types],
                },
              }
            : undefined,
        ],
      },
      limit: 10,
      offset: 10 * page - 10,
    };

    return query;
  }

  async run(text, options, page = 1, isRead = true) {
    let types = [];
    let categories = [];
    const isProtocol = this.checkIfProtocol(text);

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
      isProtocol
    );

    const manifestations = await Manifestation.findAndCountAll(query);

    // retorna qual a ultima página
    manifestations.last_page = Math.ceil(manifestations.count / 10);

    return manifestations;
  }
}

export default new SearchManifestationService();
