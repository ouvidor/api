class Manifestation {
  // valida o body do request
  async checkBody(req, res, next) {
    // Keys esperadas a serem contidas no objeto
    const expectedKeys = ['title', 'description', 'category'];

    // Keys que vieram na requisição
    const keys = Object.keys(req.body);

    // checa se o numero de atributos está correto
    if (keys.length === expectedKeys.length) {
      // compara os atributos da requisição com os esperados
      for (let i = keys.length - 1; i > -1; i -= 1) {
        if (keys[i] !== expectedKeys[i])
          return res
            .status(400)
            .json({ error: 'Corpo do request com atributos incorretos' });
      }
    } else {
      return res
        .status(400)
        .json({ error: 'Corpo do request faltando informações' });
    }
    return next();
  }
}

export default new Manifestation();
