import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';
import StatusValidator from '../middlewares/validators/Status';
import StatusController from '../controller/status.controller';

const statusRoutes = Router();

statusRoutes.use(authMiddleware);
statusRoutes.use(RolesMiddleware.admin);

statusRoutes.get('/', StatusController.fetch);
statusRoutes.get('/:id', StatusValidator.show, StatusController.show);

export default statusRoutes;
