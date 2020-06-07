import { Router } from 'express';

import ManifestationStatusHistoryValidator from '../middlewares/validators/ManifestationStatusHistory';

import fetchManifestationStatusHistory from '../services/StatusHistory/fetch';
import showManifestationStatus from '../services/StatusHistory/show';
import createManifestationStatus from '../services/StatusHistory/create';
import updateManifestationStatus from '../services/StatusHistory/update';

const statusHistoryRoutes = Router();

statusHistoryRoutes.get('/:idOrProtocol/status', async (request, response) => {
  const { idOrProtocol } = request.params;
  let manifestationProtocol;
  let manifestationId;

  // checa se é um protocolo
  if (idOrProtocol.match(/([a-z])\w+/)) {
    manifestationProtocol = idOrProtocol;
  } else {
    manifestationId = idOrProtocol;
  }

  const manifestationStatusHistory = await fetchManifestationStatusHistory({
    manifestationId,
    manifestationProtocol,
  });

  return response.status(200).json(manifestationStatusHistory);
});

statusHistoryRoutes.get('/status/:id', async (request, response) => {
  const id = Number(request.params.id);

  const statusHistory = await showManifestationStatus(id);

  return response.status(200).json(statusHistory);
});

statusHistoryRoutes.post(
  '/:manifestationId/status',
  ManifestationStatusHistoryValidator.save,
  async (request, response) => {
    const { description, status_id } = request.body;
    const manifestationId = Number(request.params.manifestationId);

    const manifestationStatus = await createManifestationStatus({
      description,
      manifestationId,
      statusIdentifier: status_id,
    });

    return response.status(201).json(manifestationStatus);
  }
);

statusHistoryRoutes.put(
  '/status/:id',
  ManifestationStatusHistoryValidator.update,
  async (request, response) => {
    const { id } = request.params;
    const { description, status_id } = request.body;

    const manifestationStatus = await updateManifestationStatus({
      statusHistoryId: id,
      description,
      statusId: status_id,
    });

    return response.status(200).json(manifestationStatus);
  }
);

export default statusHistoryRoutes;
