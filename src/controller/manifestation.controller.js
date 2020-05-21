import Manifestation from '../models/Manifestation';
import SearchManifestationService from '../services/SearchManifestationService';
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
} // fim da classe

export default new ManifestationController();
