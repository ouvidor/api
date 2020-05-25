import { Router } from 'express';

import statusHistoryRoutes from './statusHistory.routes';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';

import ManifestationValidator from '../middlewares/validators/Manifestation';
import avaliationRoutes from './avaliation.routes';

import Manifestation from '../models/Manifestation';

import searchManifestations from '../services/Manifestation/search';
import createManifestation from '../services/Manifestation/create';
import showManifestation from '../services/Manifestation/show';
import updateManifestation from '../services/Manifestation/update';

const manifestationsRoutes = Router();

manifestationsRoutes.use(authMiddleware);

manifestationsRoutes.use('/avaliation', avaliationRoutes);

manifestationsRoutes.post(
  '/',
  ManifestationValidator.save,
  async (request, response) => {
    const {
      categories_id,
      type_id,
      title,
      description,
      latitude,
      longitude,
      location,
    } = request.body;
    const city = request.user_city;
    const userId = request.user_id;

    const manifestation = await createManifestation({
      categoriesId: categories_id,
      typeId: type_id,
      title,
      description,
      latitude,
      longitude,
      location,
      city,
      userId,
    });

    return response.status(201).json(manifestation);
  }
);

manifestationsRoutes.get('/', async (request, response) => {
  const { text, options, isRead, status } = request.query;
  let { page = 1, ownerId } = request.query;
  page = page && Number(page);
  ownerId = ownerId && Number(ownerId);

  const searchResult = await searchManifestations({
    text,
    options,
    page,
    ownerId,
    isRead,
    status,
  });

  return response.status(200).json(searchResult);
});

manifestationsRoutes.get('/:idOrProtocol', async (request, response) => {
  const { idOrProtocol } = request.params;
  let protocol;
  let id;

  // checa se é um protocolo
  if (idOrProtocol.match(/([a-z])\w+/)) {
    protocol = idOrProtocol;
  } else {
    id = idOrProtocol;
  }

  const manifestation = await showManifestation({ protocol, id });

  return response.status(200).json(manifestation);
});

manifestationsRoutes.put(
  '/:id',
  ManifestationValidator.update,
  async (request, response) => {
    const { id } = request.params;
    const { type_id, categories_id, ...data } = request.body;

    const manifestation = await updateManifestation({
      id,
      typeId: type_id,
      categoriesId: categories_id,
      manifestationData: data,
    });

    return response.status(200).json(manifestation);
  }
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

manifestationsRoutes.use(statusHistoryRoutes);

export default manifestationsRoutes;
