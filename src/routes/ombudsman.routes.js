import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';

import OmbudsmanValidator from '../middlewares/validators/Ombudsman';

import fetchOmbudsmen from '../services/Ombudsman/fetch';
import showOmbudsman from '../services/Ombudsman/show';
import createOmbudsman from '../services/Ombudsman/create';
import updateOmbudsman from '../services/Ombudsman/update';

const ombudsmanRoutes = Router();

ombudsmanRoutes.use(authMiddleware);

ombudsmanRoutes.get('/', async (request, response) => {
  const ombudsmen = await fetchOmbudsmen();

  return response.status(200).json(ombudsmen);
});

ombudsmanRoutes.get('/:id', async (request, response) => {
  const id = Number(request.params.id);

  const ombudsman = await showOmbudsman(id);

  return response.status(200).json(ombudsman);
});

ombudsmanRoutes.use(RolesMiddleware.admin);

ombudsmanRoutes.put(
  '/:id',
  OmbudsmanValidator.update,
  async (request, response) => {
    const { location, telephone, email, site, attendance } = request.body;
    const id = Number(request.params.id);

    const ombudsman = await updateOmbudsman({
      id,
      location,
      telephone,
      email,
      site,
      attendance,
    });

    return response.status(200).json(ombudsman);
  }
);

ombudsmanRoutes.use(RolesMiddleware.adminMaster);

ombudsmanRoutes.post(
  '/',
  OmbudsmanValidator.save,
  async (request, response) => {
    const { location, telephone, email, site, attendance } = request.body;

    const ombudsman = await createOmbudsman({
      location,
      telephone,
      email,
      site,
      attendance,
    });

    return response.status(201).json(ombudsman);
  }
);

export default ombudsmanRoutes;
