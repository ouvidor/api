import Manifestation from '../models/Manifestation';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';

class ManifestationStatusHistoryController {
  async save(req, res) {
    const { description, status_id, secretary_id } = req.body;
    const { manifestationId } = req.params;

    const manifestation = await Manifestation.findByPk(manifestationId, {
      attributes: ['id'],
    });
    if (!manifestation) {
      return res.status(400).json({ errro: 'Essa manifestação não existe' });
    }

    try {
      const manifestationStatus = await ManifestationStatusHistory.create({
        description,
        manifestation_id: manifestation.id,
        status_id,
        secretary_id,
      });

      return res.status(200).json(manifestationStatus);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async fetch(req, res) {
    const { manifestationId } = req.params;

    // checar se a manifestação existe
    const manifestation = await Manifestation.findByPk(manifestationId, {
      attributes: ['id'],
    });
    if (!manifestation) {
      return res.status(400).json({ errro: 'Essa manifestação não existe' });
    }

    try {
      const manifestationStatusHistory = await ManifestationStatusHistory.findAll(
        { where: { manifestation_id: manifestation.id } }
      );

      return res.status(200).json(manifestationStatusHistory);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const manifestationStatus = await ManifestationStatusHistory.findByPk(id);

      if (!manifestationStatus) {
        return res
          .status(400)
          .json({ error: 'Esse status de manifestação não existe' });
      }

      return res.status(200).json(manifestationStatus);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { body: data } = req;

    try {
      const manifestationStatus = await ManifestationStatusHistory.findByPk(id);

      if (!manifestationStatus) {
        return res
          .status(400)
          .json({ error: 'Esse status de manifestação não existe' });
      }

      const updatedManifestationStatus = await manifestationStatus.update(data);

      return res.status(200).json(updatedManifestationStatus);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
} // fim da classe

export default new ManifestationStatusHistoryController();
