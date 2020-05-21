import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';
import SecretaryValidator from '../middlewares/validators/Secretary';
import SecretaryController from '../controller/secretary.controller';
import createSecretary from '../services/Secretary/create';

const secretariatsRoutes = Router();

secretariatsRoutes.use(authMiddleware);
secretariatsRoutes.use(RolesMiddleware.admin);

secretariatsRoutes.get('/', SecretaryController.fetch);
secretariatsRoutes.get('/:id', SecretaryController.show);

secretariatsRoutes.use(RolesMiddleware.adminMaster);

secretariatsRoutes.post(
  '/',
  SecretaryValidator.save,
  async (request, response) => {
    const { email, title, accountable, city } = request.body;

    const secretary = await createSecretary({
      email,
      title,
      accountable,
      city,
    });

    return response.status(201).json(secretary);
  }
);
secretariatsRoutes.put(
  '/:id',
  SecretaryValidator.update,
  SecretaryController.update
);
secretariatsRoutes.delete('/:id', SecretaryController.delete);

export default secretariatsRoutes;
