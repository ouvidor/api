import Manifestation from '../models/Manifestation';
import Category from '../models/Category';
import Type from '../models/Type';
import SearchManifestationService from '../services/SearchManifestationService';

class ManifestationController {
  async save(req, res) {
    // Cria a manifestação e salva no banco
    const { categories_id, ...data } = req.body;

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
      if (categories_id && categories_id.length > 0) {
        await manifestation.setCategories(categories_id);
      }
    } catch (error) {
      manifestation.destroy();
      console.log(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }

    return res.status(200).json(manifestation);
  }

  async fetch(req, res) {
    /**
     * text: titulo da manifestação
     * options: array de categorias e tipos de manifestações
     * isRead: flag para pesquisar apenas por manifestações lidas, 0 ou 1
     * page: a página para ser pesquisada, o resultado é limitado em 10 itens
     */
    const { text, options } = req.query;
    let { page = 1, isRead = 1 } = req.query;
    page = Number(page);
    isRead = Number(isRead);

    const query = {
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
      const manifestation = await Manifestation.findByPk(req.params.id, query);

      if (!manifestation) {
        return res.status(400).json({ error: 'essa manifestação não existe' });
      }

      return res.status(200).json(manifestation);
    }

    // pesquisa com filtro
    if (text || options) {
      const manifestations = await SearchManifestationService.run(
        text,
        options,
        page,
        isRead
      );

      return res.status(200).json(manifestations);
    }

    // pesquisa por todas as manifestações
    const manifestations = await Manifestation.findAndCountAll({
      ...query,
      // caso receba isRead, pesquisa apenas por manifestações lidas
      ...(!isRead && { where: { read: 0 } }),
      limit: 10,
      offset: 10 * page - 10,
    });

    // gambiarra, ele ta contando um a mais
    manifestations.count -= 1;
    // retorna qual a ultima página
    manifestations.last_page = Math.ceil(manifestations.count / 10);

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
