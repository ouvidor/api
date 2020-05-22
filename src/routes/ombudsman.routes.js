import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import OmbudsmanValidator from '../middlewares/validators/Ombudsman';
import OmbudsmanController from '../controller/ombudsman.controller';

const ombudsmanRoutes = Router();

ombudsmanRoutes.use(authMiddleware);

ombudsmanRoutes.get('/', OmbudsmanController.fetch);
ombudsmanRoutes.get('/:id', OmbudsmanController.show);
ombudsmanRoutes.put(
  '/:id',
  OmbudsmanValidator.update,
  OmbudsmanController.update
);

export default ombudsmanRoutes;
