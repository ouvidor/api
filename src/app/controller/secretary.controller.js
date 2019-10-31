import Secretary from '../models/Secretary';

class SecretaryController {
  // retorna todos os Secretary registrados
  async fetch(req, res) {
    const query = { attributes: ['id', 'title', 'email'] };

    if (req.params.id) {
      const secretary = await Secretary.findByPk(req.params.id, query);

      if (!secretary) {
        return res.status(400).json({ error: 'essa secretaria não existe' });
      }

      return res.status(200).json(secretary);
    }

    const secretary = await Secretary.findAll(query);

    return res.status(200).json(secretary);
  }

  // salva o Secretary no banco
  async save(req, res) {
    const doesEmailExist = await Secretary.findOne({
      where: { email: req.body.email },
    });

    // caso o email já esteja em uso
    if (doesEmailExist) {
      res.status(400).json({ error: 'uma outra secretaria já usa esse email' });
    }

    const doesSecretaryExist = await Secretary.findOne({
      where: { title: req.body.title },
    });

    // caso o titulo já esteja em uso
    if (doesSecretaryExist) {
      return res.status(400).json({ error: 'essa secretaria ja existe' });
    }

    // criar Secretary
    const { id, title, email } = await Secretary.create(req.body);

    return res.json({
      id,
      title,
      email,
    });
  }

  async update(req, res) {
    // busca pelo id do Secretary
    const secretary = await Secretary.findByPk(req.params.id);

    if (!secretary) {
      return res
        .status(401)
        .json({ error: 'essa secretaria não pode ser encontrada' });
    }

    const checkIfEmailExists = await Secretary.findOne({
      where: { email: req.body.email },
    });

    // checa se o email esta em uso
    if (checkIfEmailExists) {
      return res
        .status(400)
        .json({ error: 'uma secretaria já usa esse email' });
    }

    const checkIfTitleExists = await Secretary.findOne({
      where: { title: req.body.title },
    });

    // se existir um Secretary com esse titulo retorna um erro
    if (checkIfTitleExists) {
      return res
        .status(400)
        .json({ error: 'uma secretaria já existe com esse titulo' });
    }

    // atualiza a instancia
    const { id, title, email } = await secretary.update(req.body);

    return res.status(200).json({ id, title, email });
  }

  async delete(req, res) {
    // busca pelo id do Secretary
    const secretary = await Secretary.findByPk(req.params.id);

    if (!secretary) {
      return res
        .status(401)
        .json({ error: 'essa secretaria não pode ser encontrada' });
    }

    await secretary.destroy();

    return res.status(200).json(secretary);
  }
}

export default new SecretaryController();
