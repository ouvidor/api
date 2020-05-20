import { Router } from 'express';

import saveAvaliation from '../services/Avaliation/save';

const avaliationRoutes = Router();

avaliationRoutes.patch('/', async (request, response) => {
  const { rate, description } = request.body;
  const { id } = request.params;

  const opinion = await saveAvaliation.run({
    rate,
    description,
    userId: request.user_id,
    manifestationId: id,
  });

  return response.status(202).send(opinion);
});

export default avaliationRoutes;
