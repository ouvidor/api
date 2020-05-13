import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';
import RoleValidator from '../middlewares/validators/Role';
import RoleController from '../controller/role.controller';

const rolesRoutes = Router();

rolesRoutes.use(authMiddleware);
rolesRoutes.use(RolesMiddleware.admin);

rolesRoutes.get('/', RoleController.fetch);
rolesRoutes.get('/:id', RoleValidator.show, RoleController.show);

export default rolesRoutes;
