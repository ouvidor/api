import { Op } from 'sequelize';

import Manifestation from '../models/Manifestation';
import Category from '../models/Category';
import Type from '../models/Type';

class ManifestationController {
  async save(req, res) {
    // Cria a manifestação e salva no banco
    const { categories, ...data } = req.body;

    let manifestation;

    try {
      manifestation = await Manifestation.create({
        ...data,
        user_id: req.user_id,
      });
    } catch (error) {
      // é possivel que ocorra um erro se o token estiver invalido
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    // adicionar as categorias
    try {
      if (categories && categories.length > 0) {
        await manifestation.setCategories(categories);
      }
    } catch (error) {
      manifestation.destroy();
      console.log(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    return res.status(200).json(manifestation);
  }

  async fetch(req, res) {
    const includeAllQuery = {
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
    };

    // pesquisa por manifestação especifica
    if (req.params.id) {
      const manifestation = await Manifestation.findByPk(
        req.params.id,
        includeAllQuery
      );

      if (!manifestation) {
        return res.status(400).json({ error: 'essa manifestação não existe' });
      }

      return res.status(200).json(manifestation);
    }

    // pesquisa com filtro
    if (req.query.text || req.query.options) {
      let text;
      let types = [];
      let categories = [];

      try {
        if (req.query.text) {
          text = req.query.text;
        }

        if (req.query.options) {
          req.query.options.forEach(async option => {
            const type = await Type.findOne({ where: { title: option } });
            if (type) {
              types = [...types, type.id];
            }

            const category = await Category.findOne({
              where: { title: option },
            });
            if (category) {
              categories = [...categories, category.id];
            }
          });
        }
        console.log(categories);
        console.log(types);
        const manifestations = await Manifestation.findAll({
          ...includeAllQuery,
          where: {
            title: {
              [Op.like]: `%${text}%`,
            },
            type_id: {
              [Op.or]: [...types],
            },
            categories_id: {
              [Op.or]: [...categories],
            },
          },
        });

        return res.status(200).json(manifestations);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    // pesquisa por todas as manifestações
    const manifestations = await Manifestation.findAll(includeAllQuery);

    return res.status(200).json(manifestations);
  }

  async update(req, res) {
    let manifestation = await Manifestation.findByPk(req.params.id);

    if (!manifestation) {
      return res
        .status(401)
        .json({ error: 'essa manifestação não pôde ser encontrada' });
    }

    // atualiza a instancia
    manifestation = await manifestation.update(req.body);

    return res.status(200).json(manifestation);
  }
} // fim da classe

export default new ManifestationController();
