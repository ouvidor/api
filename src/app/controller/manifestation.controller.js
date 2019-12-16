import Manifestation from '../models/Manifestation';
import Category from '../models/Category';
import Type from '../models/Type';
import SearchManifestationService from '../services/SearchManifestationService';
import GeolocationService from '../services/GeolocationService';

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

    let manifestations;

    // pesquisa com filtro
    if (text || options) {
      manifestations = await SearchManifestationService.run(
        text,
        options,
        page,
        isRead
      );
    } else {
      // pesquisa por todas as manifestações
      manifestations = await Manifestation.findAndCountAll({
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
        // caso receba isRead, pesquisa apenas por manifestações lidas
        ...(!isRead && { where: { read: 0 } }),
        limit: 10,
        offset: 10 * page - 10,
      });
    }

    // retorna qual a ultima página
    manifestations.last_page = Math.ceil(manifestations.count / 10);

    // gambiarra, ele ta contando um a mais
    // manifestations.count -= 1;

    return res.status(200).json(manifestations);
  }

  async show(req, res) {
    const { idOrProtocol } = req.params;
    let isProtocol = false;

    // checa se é um protocolo
    if (idOrProtocol && idOrProtocol.match(/\d*-\d/)) {
      isProtocol = true;
    }

    const manifestation = await Manifestation.findOne({
      where: {
        // decide se busca por protocolo ou id
        ...(isProtocol ? { protocol: idOrProtocol } : { id: idOrProtocol }),
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

    if (!manifestation) {
      return res.status(400).json({ error: 'essa manifestação não existe' });
    }

    return res.status(200).json(manifestation);
  }

  async save(req, res) {
    // Cria a manifestação e salva no banco
    const { categories_id, ...data } = req.body;

    let manifestation;

    const geolocationData = await GeolocationService.run(data);
    const formattedData = { ...data, ...geolocationData };

    try {
      manifestation = await Manifestation.create({
        ...formattedData,
        user_id: req.user_id,
      });
    } catch (error) {
      // é possivel que ocorra um erro se o token estiver invalido
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    // adicionar as categorias
    try {
      if (categories_id && categories_id.length > 0) {
        await manifestation.setCategories(categories_id);
      }
    } catch (error) {
      manifestation.destroy();
      console.log(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    // o protocolo não foi gerado ainda, portanto ele fica 0
    delete manifestation.dataValues.protocol;
    return res.status(200).json(manifestation);
  }

  async update(req, res) {
    let manifestation = await Manifestation.findByPk(req.params.id);
    const geolocationData = await GeolocationService.run(req.body);
    const formattedData = { ...req.body, ...geolocationData };

    if (!manifestation) {
      return res
        .status(401)
        .json({ error: 'essa manifestação não pôde ser encontrada' });
    }

    // atualiza a instancia
    manifestation = await manifestation.update(formattedData);

    return res.status(200).json(manifestation);
  }
} // fim da classe

export default new ManifestationController();
