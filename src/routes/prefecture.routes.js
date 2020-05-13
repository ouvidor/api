import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import PrefectureValidator from '../middlewares/validators/PrefectureAndOmbudsman';
import PrefectuerController from '../controller/prefecture.controller';

const prefectureRoutes = Router();

prefectureRoutes.use(authMiddleware);

prefectureRoutes.get('/', PrefectuerController.fetch);
prefectureRoutes.get('/:id', PrefectuerController.show);
prefectureRoutes.put(
  '/:id',
  PrefectureValidator.update,
  PrefectuerController.update
);

export default prefectureRoutes;
