import Type from '../models/Type';

class TypeController {
  // retorna todos os Type registrados
  async fetchAll(req, res) {
    Type.findAll()
      .then(type => {
        console.log(type);
        res.json(type);
      })
      .catch(err => console.log(err));
  }

  // salva o type no banco
  async save(req, res) {
    const doesTypeExist = await Type.findOne({
      where: { title: req.body.title },
    });

    // caso o type já exista
    if (doesTypeExist) {
      return res.status(400).json({ error: 'tipo ja existe' });
    }

    // criar type
    const { id, title } = await Type.create(req.body);

    return res.json({
      id,
      title,
    });
  }

  // recebe um id nos parametros da rota e um title no body
  async update(req, res) {
    // busca pelo id do Type
    const type = await Type.findByPk(req.params.id);

    if (!type) {
      return res
        .status(401)
        .json({ error: 'esse tipo não pode ser encontrado' });
    }

    // busca por um Type com esse titulo passado
    const checkIfTitleExists = await Type.findOne({
      where: { title: req.body.title },
    });

    // se existir um Type com esse titulo retorna um erro
    if (checkIfTitleExists) {
      return res
        .status(400)
        .json({ error: 'um tipo já existe com esse titulo' });
    }

    // atualiza a instancia
    const { id, title } = await type.update(req.body);

    return res.status(200).json({ id, title });
  }
}

export default new TypeController();
