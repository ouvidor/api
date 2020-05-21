import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import TypeValidator from '../middlewares/validators/Type';
import fetchTypes from '../services/Type/fetch';
import showType from '../services/Type/show';

const typesRoutes = Router();

typesRoutes.use(authMiddleware);

typesRoutes.get('/', async (request, response) => {
  const types = await fetchTypes();

  return response.status(200).json(types);
});

typesRoutes.get('/:id', TypeValidator.show, async (request, response) => {
  const id = Number(request.params.id);

  const type = await showType(id);

  return response.status(200).json(type);
});

export default typesRoutes;
