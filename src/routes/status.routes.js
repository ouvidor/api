import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import RolesMiddleware from '../app/middlewares/roles';
import StatusValidator from '../app/middlewares/validators/Status';
import StatusController from '../app/controller/status.controller';

const statusRoutes = Router();

statusRoutes.use(authMiddleware);
statusRoutes.use(RolesMiddleware.admin);

statusRoutes.get('/', StatusController.fetch);
statusRoutes.get('/:id', StatusValidator.show, StatusController.show);

export default statusRoutes;
