import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import RolesMiddleware from '../app/middlewares/roles';

import ManifestationValidator from '../app/middlewares/validators/Manifestation';
import ManifestationController from '../app/controller/manifestation.controller';

import ManifestationStatusHistoryValidator from '../app/middlewares/validators/ManifestationStatusHistory';
import ManifestationStatusHistoryController from '../app/controller/manifestationStatusHistory.controller';

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
