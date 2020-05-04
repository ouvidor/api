import Manifestation from '../models/Manifestation';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';
import SetStatusToManifestation from '../services/SetStatusToManifestation';
import Status from '../models/Status';

class ManifestationStatusHistoryController {
  async save(req, res) {
    const { description, status_id } = req.body;
    const { manifestationId } = req.params;

    const manifestation = await Manifestation.findByPk(manifestationId, {
      attributes: ['id'],
    });
    if (!manifestation) {
      return res.status(400).json({ message: 'Essa manifestação não existe' });
    }

    try {
      const manifestationStatus = await SetStatusToManifestation.run(
        manifestation,
        status_id,
        description
      );

      return res.status(200).json(manifestationStatus);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }

  async fetch(req, res) {
    const { idOrProtocol } = req.params;
    let isProtocol = false;
    let manifestationStatusHistory;

    // checa se é um protocolo
    if (idOrProtocol && idOrProtocol.match(/\d*-\d/)) {
      isProtocol = true;
    }

    try {
      let manifestation = null;

      if (isProtocol) {
        manifestation = await Manifestation.findOne({
          where: { protocol: idOrProtocol },
          attributes: ['id'],
        });
      } else {
        manifestation = await Manifestation.findOne({
          where: { id: idOrProtocol },
          attributes: ['id'],
        });
      }

      if (!manifestation) {
        return res
          .status(400)
          .json({ message: 'Essa manfestação não existe.' });
      }

      manifestationStatusHistory = await ManifestationStatusHistory.findAll({
        where: { manifestations_id: manifestation.id },
        include: [{ model: Status, as: 'status' }],
      });

      return res.status(200).json(manifestationStatusHistory);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const manifestationStatus = await ManifestationStatusHistory.findByPk(
        id,
        { include: [{ model: Status, as: 'status' }] }
      );

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
      const manifestationStatus = await ManifestationStatusHistory.findByPk(
        id,
        { include: [{ model: Status, as: 'status' }] }
      );

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
