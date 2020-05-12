import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import RolesMiddleware from '../app/middlewares/roles';

import ManifestationValidator from '../app/middlewares/validators/Manifestation';
import ManifestationController from '../app/controller/manifestation.controller';

import ManifestationStatusHistoryValidator from '../app/middlewares/validators/ManifestationStatusHistory';
import ManifestationStatusHistoryController from '../app/controller/manifestationStatusHistory.controller';
import Manifestation from '../app/models/Manifestation';

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

  await manifestation.update({ read: true });

  return response.status(204).json({ message: 'A manifestação foi lida' });
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
