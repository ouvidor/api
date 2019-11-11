import { Op } from 'sequelize';

import Manifestation from '../models/Manifestation';
import Type from '../models/Type';
import Category from '../models/Category';

class ManifestationService {
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

    types = await Promise.all(types);
    categories = await Promise.all(categories);

    const filteredTypes = types.filter(type => type !== null);
    const filteredCategories = categories.filter(category => category !== null);

    return [filteredTypes, filteredCategories];
  }

  async search(text, options) {
    let types = [];
    let categories = [];

    if (options) {
      [types, categories] = await this.fetchOptionsIds(options);
    }

    const manifestations = await Manifestation.findAll({
      where: {
        [Op.and]: [
          {
            title: text
              ? {
                  [Op.like]: `%${text}%`,
                }
              : undefined,
          },
          // {
          //   [Op.or]: [
          //     {
          //       type_id:
          //         types.length > 0
          //           ? {
          //               type_id: [...types],
          //             }
          //           : undefined,
          //     },
          //     {
          //       categories_id:
          //         categories.length > 0
          //           ? {
          //               categories_id: [...categories],
          //             }
          //           : undefined,
          //     },
          //   ],
          // },
        ],
      },
      include: [
        {
          model: Category,
          as: 'categories',
          // só pega o id e o título
          attributes: ['id', 'title'],
          // a linha abaixo previne que venham informações desnecessárias
          through: { attributes: [] },
        },
        {
          model: Type,
          as: 'type',
          attributes: ['id', 'title'],
        },
      ],
    });

    return manifestations;
  }
}

export default new ManifestationService();
