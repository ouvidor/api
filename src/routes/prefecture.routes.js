import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import PrefectureValidator from '../app/middlewares/validators/PrefectureAndOmbudsman';
import PrefectuerController from '../app/controller/prefecture.controller';

const prefectureRoutes = Router();

prefectureRoutes.use(authMiddleware);

prefectureRoutes.get('/', PrefectuerController.fetch);
prefectureRoutes.put(
  '/',
  PrefectureValidator.update,
  PrefectuerController.update
);

export default prefectureRoutes;