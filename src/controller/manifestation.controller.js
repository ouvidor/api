import { Op } from 'sequelize';

import Manifestation from '../models/Manifestation';
import Type from '../models/Type';
import Category from '../models/Category';
import SearchManifestationService from '../services/SearchManifestationService';
import GenerateGeolocation from '../services/GenerateGeolocation';
import manifestationIncludes from '../utils/manifestationIncludes';

class ManifestationController {
  async fetch(req, res) {
    /**
     * text: titulo da manifestação ou protocolo
     * options: array de categorias e tipos de manifestações
     * isRead: flag para pesquisar apenas por manifestações lidas, 0 ou 1
     * page: a página para ser pesquisada, o resultado é limitado em 10 itens
     * ownerId: o id do usuário dono da manifestação
     * status: busca por manifestações que tenham esse status
     */
    const { text, options } = req.query;
    const { isRead, status } = req.query;
    let { page = 1, ownerId } = req.query;
    page = Number(page);
    ownerId = Number(ownerId);
    if (ownerId === 0) {
      return res.status(400).json({ message: 'Esse usuário não existe.' });
    }

    let manifestationQueryResult;
    // pesquisa com filtros
    if (text || options || ownerId || status || isRead !== undefined) {
      manifestationQueryResult = await SearchManifestationService.run(
        text,
        options,
        page,
        isRead,
        ownerId,
        status
      );
    } else {
      // pesquisa por todas as manifestações
      manifestationQueryResult = await Manifestation.findAndCountAll({
        attributes: {
          exclude: ['users_id', 'types_id', 'secretariats_id'],
        },
        include: manifestationIncludes,
        limit: 10,
        offset: 10 * page - 10,
        distinct: true,
      });
    }

    // retorna qual a ultima página
    const last_page = Math.ceil(manifestationQueryResult.count / 10);

    return res.status(200).json({ ...manifestationQueryResult, last_page });
  }

  async show(req, res) {
    const { idOrProtocol } = req.params;
    let isProtocol = false;

    // checa se é um protocolo
    if (idOrProtocol && idOrProtocol.match(/([a-z])\w+/)) {
      isProtocol = true;
    }

    const manifestation = await Manifestation.findOne({
      attributes: {
        exclude: ['users_id', 'types_id', 'secretariats_id'],
      },
      where: {
        // decide se busca por protocolo ou id
        ...(isProtocol ? { protocol: idOrProtocol } : { id: idOrProtocol }),
      },
      include: manifestationIncludes,
    });

    if (!manifestation) {
      return res.status(400).json({ message: 'essa manifestação não existe' });
    }

    return res.status(200).json(manifestation);
  }

  async update(req, res) {
    const { type_id, categories_id, ...data } = req.body;

    if (type_id) {
      const typeExists = await Type.findOne({ where: { id: type_id } });

      if (!typeExists) {
        return res
          .status(400)
          .json({ message: 'Esse tipo de manifestação não existe.' });
      }
    }

    let manifestation = await Manifestation.findByPk(req.params.id);

    if (categories_id) {
      const categoriesExists = await Category.findAll({
        where: {
          id: {
            [Op.in]: categories_id,
          },
        },
      });

      if (categoriesExists.length !== categories_id.length) {
        return res
          .status(400)
          .json({ message: 'Uma dessas categorias não existe.' });
      }

      await manifestation.setCategories(categories_id);
    }

    const geolocationData = await GenerateGeolocation.run(data);
    const formattedData = { ...data, types_id: type_id, ...geolocationData };

    if (!manifestation) {
      return res
        .status(401)
        .json({ message: 'Essa manifestação não pôde ser encontrada.' });
    }

    // atualiza a instancia
    manifestation = await manifestation.update(formattedData);

    return res.status(200).json(manifestation);
  }
} // fim da classe

export default new ManifestationController();
