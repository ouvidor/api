import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import TypeValidator from '../middlewares/validators/Type';
import TypeController from '../controller/type.controller';

const typesRoutes = Router();

typesRoutes.use(authMiddleware);

typesRoutes.get('/', TypeController.fetch);
typesRoutes.get('/:id', TypeValidator.show, TypeController.show);

export default typesRoutes;
