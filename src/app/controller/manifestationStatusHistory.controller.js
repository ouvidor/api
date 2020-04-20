import Manifestation from '../models/Manifestation';
import arrayOfStatus from '../data/status';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';
import SetStatusToManifestation from '../services/SetStatusToManifestation';

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

      const formattedManifestationStatus = {
        ...manifestationStatus.dataValues,
        status_id: undefined,
        status: arrayOfStatus.find(s => s.id === manifestationStatus.status_id),
      };

      return res.status(200).json(formattedManifestationStatus);
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
      if (isProtocol) {
        // procura por manifestação com esse protocolo
        const manifestation = await Manifestation.findOne({
          where: { protocol: idOrProtocol },
          attributes: ['id'],
        });

        // agora que tem o protocolo busca pelo id
        manifestationStatusHistory = await ManifestationStatusHistory.findAll({
          where: { manifestation_id: manifestation.id },
        });
      } else {
        manifestationStatusHistory = await ManifestationStatusHistory.findAll({
          where: { manifestation_id: idOrProtocol },
        });
      }

      const formattedManifestationStatusHistory = manifestationStatusHistory.map(
        mSH => ({
          ...mSH.dataValues,
          status: arrayOfStatus.find(s => s.id === mSH.status_id),
        })
      );

      return res.status(200).json(formattedManifestationStatusHistory);
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

      const formattedManifestation = {
        ...manifestationStatus.dataValues,
        status_id: undefined,
        status: arrayOfStatus.find(s => s.id === manifestationStatus.status_id),
      };

      return res.status(200).json(formattedManifestation);
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

      const formattedManifestationStatus = {
        ...updatedManifestationStatus.dataValues,
        status_id: undefined,
        status: arrayOfStatus.find(
          s => s.id === updatedManifestationStatus.status_id
        ),
      };

      return res.status(200).json(formattedManifestationStatus);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
} // fim da classe

export default new ManifestationStatusHistoryController();
