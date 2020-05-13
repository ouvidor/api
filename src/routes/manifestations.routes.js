import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';

import ManifestationValidator from '../middlewares/validators/Manifestation';
import ManifestationController from '../controller/manifestation.controller';

import ManifestationStatusHistoryValidator from '../middlewares/validators/ManifestationStatusHistory';
import ManifestationStatusHistoryController from '../controller/manifestationStatusHistory.controller';
import Manifestation from '../models/Manifestation';

const manifestationsRoutes = Router();

manifestationsRoutes.use(authMiddleware);

manifestationsRoutes.post(
  '/',
  ManifestationValidator.save,
  ManifestationController.save
);

manifestationsRoutes.get('/', ManifestationController.fetch);

manifestationsRoutes.get('/:idOrProtocol', ManifestationController.show);

manifestationsRoutes.put(
  '/:id',
  ManifestationValidator.update,
  ManifestationController.update
);

manifestationsRoutes.use(RolesMiddleware.admin);

manifestationsRoutes.patch('/:id/read', async (request, response) => {
  const { id } = request.params;

  const manifestation = await Manifestation.findOne({ where: { id } });

  if (!manifestation) {
    return response
      .status(404)
      .json({ message: 'Essa manifestação não existe.' });
  }

  await manifestation.update({ read: true });

  return response.status(204).json();
});

manifestationsRoutes.get(
  '/:idOrProtocol/status',
  ManifestationStatusHistoryController.fetch
);
manifestationsRoutes.get(
  '/status/:id',
  ManifestationStatusHistoryController.show
);
manifestationsRoutes.post(
  '/:manifestationId/status',
  ManifestationStatusHistoryValidator.save,
  ManifestationStatusHistoryController.save
);
manifestationsRoutes.put(
  '/status/:id',
  ManifestationStatusHistoryValidator.update,
  ManifestationStatusHistoryController.update
);

export default manifestationsRoutes;
