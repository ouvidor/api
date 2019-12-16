import Manifestation from '../models/Manifestation';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';

class ManifestationStatusHistoryController {
  async fetchManifestation(id) {
    const manifestation = await Manifestation.findByPk(id);

    if (!manifestation) throw new Error('Essa manifestação não existe');

    return manifestation;
  }

  async save(req, res) {
    const { description, status_id, secretary_id } = req.body;
    const { manifestationId } = req.params;

    try {
      await this.fetchManifestation(req.params.manifestationId);
    } catch (error) {
      return res.status(400).json({ error });
    }

    try {
      const manifestationStatus = await ManifestationStatusHistory.create({
        description,
        manifestation_id: manifestationId,
        status_id,
        secretary_id,
      });

      return res.status(200).json(manifestationStatus);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async fetch(req, res) {
    const { manifestationId, id } = req.params;

    // checar se a manifestação existe
    try {
      await this.fetchManifestation(manifestationId);
    } catch (error) {
      return res.status(400).json({ error });
    }

    try {
      // caso esteja buscando um status de manifestação específico
      if (id) {
        const manifestationStatus = await ManifestationStatusHistory.findByPk(
          id
        );

        return res.status(200).json(manifestationStatus);
      }

      // caso normal, onde não é especificado o id
      const manifestationStatusHistory = await ManifestationStatusHistory.findAll(
        { where: { manifestation_id: manifestationId } }
      );

      return res.status(200).json(manifestationStatusHistory);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async update(req, res) {
    const { manifestationId, id } = req.params;

    try {
      await this.fetchManifestation(manifestationId);
    } catch (error) {
      return res.status(400).json({ error });
    }

    try {
      const manifestationStatus = await ManifestationStatusHistory.findByPk(id);

      const updatedManifestationStatus = await manifestationStatus.update(
        req.body
      );

      return res.status(200).json(updatedManifestationStatus);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
} // fim da classe

export default new ManifestationStatusHistoryController();
