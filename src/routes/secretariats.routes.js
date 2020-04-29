import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import RolesMiddleware from '../app/middlewares/roles';
import SecretaryValidator from '../app/middlewares/validators/Secretary';
import SecretaryController from '../app/controller/secretary.controller';

const secretariatsRoutes = Router();

secretariatsRoutes.use(authMiddleware);
secretariatsRoutes.use(RolesMiddleware.admin);

secretariatsRoutes.get('/', SecretaryController.fetch);
secretariatsRoutes.get('/:id', SecretaryController.show);

secretariatsRoutes.use(RolesMiddleware.adminMaster);

secretariatsRoutes.post('/', SecretaryValidator.save, SecretaryController.save);
secretariatsRoutes.put(
  '/:id',
  SecretaryValidator.update,
  SecretaryController.update
);
secretariatsRoutes.delete('/:id', SecretaryController.delete);

export default secretariatsRoutes;
