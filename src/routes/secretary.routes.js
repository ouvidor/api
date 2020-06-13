import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';
import SecretaryValidator from '../middlewares/validators/Secretary';

import fetchSecretariats from '../services/Secretary/fetch';
import showSecretary from '../services/Secretary/show';
import createSecretary from '../services/Secretary/create';
import updateSecretary from '../services/Secretary/update';
import deleteSecretary from '../services/Secretary/delete';

const secretariatsRoutes = Router();

secretariatsRoutes.use(authMiddleware);
secretariatsRoutes.use(RolesMiddleware.admin);

secretariatsRoutes.get('/', async (request, response) => {
  const { user_city } = request;

  const secretariats = await fetchSecretariats({ city: user_city });

  return response.status(200).json(secretariats);
});

secretariatsRoutes.get('/:id', async (request, response) => {
  const id = Number(request.params.id);

  const secretary = await showSecretary(id);

  return response.status(200).json(secretary);
});

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
  async (request, response) => {
    const { title, accountable, email } = request.body;
    const id = Number(request.params.id);

    const secretary = await updateSecretary({ id, title, accountable, email });

    return response.status(200).json(secretary);
  }
);

secretariatsRoutes.delete('/:id', async (request, response) => {
  const id = Number(request.params.id);

  const secretary = await deleteSecretary(id);

  return response.status(200).json(secretary);
});

export default secretariatsRoutes;
