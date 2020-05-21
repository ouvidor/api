import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';
import StatusValidator from '../middlewares/validators/Status';
import fetchStatus from '../services/Status/fetch';
import showStatus from '../services/Status/show';

const statusRoutes = Router();

statusRoutes.use(authMiddleware);
statusRoutes.use(RolesMiddleware.admin);

statusRoutes.get('/', async (request, response) => {
  const status = await fetchStatus();

  return response.status(200).json(status);
});

statusRoutes.get('/:id', StatusValidator.show, async (request, response) => {
  const id = Number(request.params.id);

  const status = await showStatus(id);

  return response.status(200).json(status);
});

export default statusRoutes;
