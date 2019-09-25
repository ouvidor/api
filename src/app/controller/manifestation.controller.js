import Manifestation from '../models/Manifestation';
import User from '../models/User';

class ManifestationController {
  // Retorna todas entries de Users no DB, temporário, !somente para teste!
  async test(req, res) {
    res.send({ message: 'ok' });
  }

  async saveToDb(req, res) {
    // Cria a manifestação e salva no banco
    const manifestation = await Manifestation.create(req.body);
    await manifestation
      .setUser(await User.findByPk(req.user_id))
      .then(console.log('salvou'))
      .catch();

    // res.json(id, title, description, category);
    res.json(manifestation);
  }
} // fim da classe

export default new ManifestationController();
