import Manifestation from '../models/Manifestation';
import User from '../models/User';
import SearchManifestationService from '../services/SearchManifestationService';
import GeolocationService from '../services/GeolocationService';
import SetStatusToManifestation from '../services/SetStatusToManifestation';
import manifestationIncludes from '../utils/manifestationIncludes';
import { CADASTRADA } from '../data/status';
import arrayOfTypes from '../data/types';

class ManifestationController {
  async fetch(req, res) {
    /**
     * text: titulo da manifestação ou protocolo
     * options: array de categorias e tipos de manifestações
     * isRead: flag para pesquisar apenas por manifestações lidas, 0 ou 1
     * page: a página para ser pesquisada, o resultado é limitado em 10 itens
     */
    const { text, options } = req.query;
    let { page = 1, isRead = 1 } = req.query;
    page = Number(page);
    isRead = Number(isRead);

    let manifestationQueryResult;

    // pesquisa com filtro
    if (text || options) {
      manifestationQueryResult = await SearchManifestationService.run(
        text,
        options,
        page,
        isRead
      );
    } else {
      // pesquisa por todas as manifestações
      manifestationQueryResult = await Manifestation.findAndCountAll({
        include: manifestationIncludes,
        // caso receba isRead, pesquisa apenas por manifestações lidas
        ...(!isRead && { where: { read: 0 } }),
        limit: 10,
        offset: 10 * page - 10,
      });
    }

    // retorna qual a ultima página
    const last_page = Math.ceil(manifestationQueryResult.count / 10);

    const formattedQueryResult = {
      count: manifestationQueryResult.count,
      rows: manifestationQueryResult.rows.map(manifestation => ({
        ...manifestation.dataValues,
        type_id: undefined, // remove type_id
        type: arrayOfTypes.find(type => type.id === manifestation.type_id),
      })),
      last_page,
    };

    return res.status(200).json(formattedQueryResult);
  }

  async show(req, res) {
    const { idOrProtocol } = req.params;
    let isProtocol = false;

    // checa se é um protocolo
    if (idOrProtocol && idOrProtocol.match(/([a-z])\w+/)) {
      isProtocol = true;
    }

    const manifestation = await Manifestation.findOne({
      where: {
        // decide se busca por protocolo ou id
        ...(isProtocol ? { protocol: idOrProtocol } : { id: idOrProtocol }),
      },
      include: manifestationIncludes,
    });

    if (!manifestation) {
      return res.status(400).json({ message: 'essa manifestação não existe' });
    }

    const formattedManifestation = {
      ...manifestation.dataValues,
      type_id: undefined,
      type: arrayOfTypes.find(type => type.id === manifestation.type_id),
    };

    return res.status(200).json(formattedManifestation);
  }

  async save(req, res) {
    // Cria a manifestação e salva no banco
    const { categories_id, ...data } = req.body;

    // caso o token informado seja de um usuário que não existe
    const user = await User.findByPk(req.user_id);
    if (!user) {
      return res.status(401).json({ message: 'Esse usuário não existe' });
    }

    let manifestation;

    const geolocationData = await GeolocationService.run(data);
    const formattedData = { ...data, ...geolocationData };
    try {
      manifestation = await Manifestation.create({
        ...formattedData,
        user_id: req.user_id,
      });

      if (categories_id && categories_id.length) {
        await manifestation.setCategories(categories_id);
      }

      await SetStatusToManifestation.run(
        manifestation,
        CADASTRADA,
        `A manifestação foi cadastrada`
      );
    } catch (error) {
      if (manifestation) {
        manifestation.destroy();
      }
      console.error(error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }

    return res.status(200).json(manifestation);
  }

  async update(req, res) {
    let manifestation = await Manifestation.findByPk(req.params.id);
    const geolocationData = await GeolocationService.run(req.body);
    const formattedData = { ...req.body, ...geolocationData };

    if (!manifestation) {
      return res
        .status(401)
        .json({ message: 'essa manifestação não pôde ser encontrada' });
    }

    // atualiza a instancia
    manifestation = await manifestation.update(formattedData);

    return res.status(200).json(manifestation);
  }
} // fim da classe

export default new ManifestationController();
