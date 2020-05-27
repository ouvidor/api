import { Router } from 'express';

import AvaliationValidator from '../middlewares/validators/Avaliation';
import createAvaliation from '../services/Avaliation/create';

const avaliationRoutes = Router();

avaliationRoutes.get('/avaliation', async (request, response) => {
  return response.status(501).send();
});

avaliationRoutes.get('/:id/avaliation', async (request, response) => {
  return response.status(501).send();
});

avaliationRoutes.post(
  '/:id/avaliation',
  AvaliationValidator.save,
  async (request, response) => {
    const { rate, description, reopen } = request.body;
    const { id } = request.params;
    const { user_id } = request;

    const avaliation = await createAvaliation({
      rate,
      description,
      manifestationId: id,
      userId: user_id,
      reopen,
    });

    return response.status(201).send(avaliation);
  }
);

export default avaliationRoutes;
