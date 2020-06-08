import { Router } from 'express';

import statusHistoryRoutes from './statusHistory.routes';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';

import ManifestationValidator from '../middlewares/validators/Manifestation';
import avaliationRoutes from './avaliation.routes';

import searchManifestations from '../services/Manifestation/search';
import createManifestation from '../services/Manifestation/create';
import showManifestation from '../services/Manifestation/show';
import updateManifestation from '../services/Manifestation/update';
import cancelManifestation from '../services/Manifestation/cancel';
import markManifestationAsRead from '../services/Manifestation/read';
import linkManifestationToSecretary from '../services/Manifestation/linkSecretary';

const manifestationsRoutes = Router();

manifestationsRoutes.use(authMiddleware);

manifestationsRoutes.use(avaliationRoutes);

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

manifestationsRoutes.get(
  '/',
  ManifestationValidator.fetch,
  async (request, response) => {
    const { text, options, isRead, status, cancelled } = request.query;
    let { page = 1, ownerId } = request.query;
    page = page && Number(page);
    ownerId = ownerId && Number(ownerId);

    const searchResult = await searchManifestations({
      text,
      options,
      page,
      ownerId,
      isRead,
      cancelled,
      status,
    });

    return response.status(200).json(searchResult);
  }
);

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
    const { user_id } = request;

    const manifestation = await updateManifestation({
      id,
      typeId: type_id,
      categoriesId: categories_id,
      manifestationData: data,
      userId: user_id,
    });

    return response.status(200).json(manifestation);
  }
);

manifestationsRoutes.use(RolesMiddleware.admin);

manifestationsRoutes.delete('/:id', async (request, response) => {
  const id = Number(request.params.id);
  const { user_id } = request;

  await cancelManifestation({ id, userId: user_id });

  return response.status(204).send();
});

manifestationsRoutes.patch('/:id/read', async (request, response) => {
  const { id } = request.params;

  await markManifestationAsRead(id);

  return response.status(204).json();
});

manifestationsRoutes.patch(
  '/:manifestationId/secretary/:secretaryId',
  async (request, response) => {
    let { manifestationId, secretaryId } = request.params;

    manifestationId = Number(manifestationId);
    secretaryId = Number(secretaryId);

    await linkManifestationToSecretary({
      manifestationId,
      secretaryId,
    });

    return response.status(204).json();
  }
);

manifestationsRoutes.use(statusHistoryRoutes);

export default manifestationsRoutes;
