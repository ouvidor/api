import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import OmbudsmanValidator from '../app/middlewares/validators/PrefectureAndOmbudsman';
import OmbudsmanController from '../app/controller/ombudsman.controller';

const ombudsmanRoutes = Router();

ombudsmanRoutes.use(authMiddleware);

ombudsmanRoutes.get('/', OmbudsmanController.fetch);
ombudsmanRoutes.put('/', OmbudsmanValidator.update, OmbudsmanController.update);

export default ombudsmanRoutes;
