import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import TypeValidator from '../app/middlewares/validators/Type';
import TypeController from '../app/controller/type.controller';

const typesRoutes = Router();

typesRoutes.use(authMiddleware);

typesRoutes.get('/', TypeController.fetch);
typesRoutes.get('/:id', TypeValidator.show, TypeController.show);

export default typesRoutes;
