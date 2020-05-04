import Secretary from '../models/Secretary';

class SecretaryController {
  // retorna todos os Secretary registrados
  async fetch(req, res) {
    const secretary = await Secretary.findAll({
      attributes: ['id', 'title', 'email', 'accountable'],
    });

    return res.status(200).json(secretary);
  }

  // retorna apenas uma Secretary
  async show(req, res) {
    const secretary = await Secretary.findByPk(req.params.id, {
      attributes: ['id', 'title', 'email', 'accountable'],
    });

    if (!secretary) {
      return res.status(400).json({ message: 'Essa secretaria não existe.' });
    }

    return res.status(200).json(secretary);
  }

  // salva o Secretary no banco
  async save(req, res) {
    const doesEmailExist = await Secretary.findOne({
      where: { email: req.body.email },
    });

    // caso o email já esteja em uso
    if (doesEmailExist) {
      res
        .status(400)
        .json({ error: 'Uma outra secretaria já usa esse email.' });
    }

    const doesSecretaryExist = await Secretary.findOne({
      where: { title: req.body.title },
    });

    // caso o titulo já esteja em uso
    if (doesSecretaryExist) {
      return res.status(400).json({ message: 'Essa secretaria ja existe.' });
    }

    // criar Secretary
    const { id, title, email, accountable } = await Secretary.create(req.body);

    return res.json({
      id,
      title,
      email,
      accountable,
    });
  }

  async update(req, res) {
    // busca pelo id do Secretary
    const secretary = await Secretary.findByPk(req.params.id);

    if (!secretary) {
      return res
        .status(401)
        .json({ message: 'Essa secretaria não pode ser encontrada.' });
    }

    // se receber um email checa se ele está em uso
    if (req.body.email && req.body.email !== secretary.email) {
      const checkIfEmailExists = await Secretary.findOne({
        where: { email: req.body.email },
      });

      if (checkIfEmailExists) {
        return res
          .status(400)
          .json({ message: 'Uma secretaria já usa esse email.' });
      }
    }

    // se receber um title checa se ele está em uso
    if (req.body.title && req.body.title !== secretary.title) {
      const checkIfTitleExists = await Secretary.findOne({
        where: { title: req.body.title },
      });

      if (checkIfTitleExists) {
        return res
          .status(400)
          .json({ message: 'Uma secretaria já existe com esse titulo.' });
      }
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
        .json({ error: 'Essa secretaria não pode ser encontrada.' });
    }

    await secretary.destroy();

    return res.status(200).json(secretary);
  }
}

export default new SecretaryController();
