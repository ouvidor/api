import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';
import PrefectureValidator from '../middlewares/validators/PrefectureAndOmbudsman';

import fetchPrefectures from '../services/Prefecture/fetch';
import showPrefecture from '../services/Prefecture/show';
import createPrefecture from '../services/Prefecture/create';
import updatePrefecture from '../services/Prefecture/update';

const prefectureRoutes = Router();

prefectureRoutes.use(authMiddleware);

prefectureRoutes.get('/', async (request, response) => {
  const prefectures = await fetchPrefectures();

  return response.status(200).json(prefectures);
});

prefectureRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;
  let nameToSearch;
  let idToSearch;

  if (isNaN(id)) {
    nameToSearch = id;
  } else {
    idToSearch = id;
  }

  const prefecture = await showPrefecture({ nameToSearch, idToSearch });

  return response.status(200).json(prefecture);
});

prefectureRoutes.use(RolesMiddleware.admin);

prefectureRoutes.put(
  '/:id',
  PrefectureValidator.update,
  async (request, response) => {
    const { id } = request.params;
    const {
      name,
      email,
      site,
      telephone,
      location,
      attendance,
      ombudsmen_id,
    } = request.body;

    let nameToSearch;
    let idToSearch;

    if (isNaN(id)) {
      nameToSearch = id;
    } else {
      idToSearch = id;
    }

    const prefecture = await updatePrefecture({
      idToSearch,
      nameToSearch,
      name,
      email,
      site,
      telephone,
      location,
      attendance,
      ombudsmanId: ombudsmen_id,
    });

    return response.status(200).json(prefecture);
  }
);

prefectureRoutes.use(RolesMiddleware.adminMaster);

prefectureRoutes.post('/', async (request, response) => {
  const {
    name,
    location,
    telephone,
    email,
    site,
    attendance,
    ombudsmen_id,
  } = request.body;

  const prefecture = await createPrefecture({
    name,
    location,
    telephone,
    email,
    site,
    attendance,
    ombudsmanId: ombudsmen_id,
  });

  return response.status(201).json(prefecture);
});

export default prefectureRoutes;
