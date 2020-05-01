import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import RolesMiddleware from '../app/middlewares/roles';
import RoleValidator from '../app/middlewares/validators/Role';
import RoleController from '../app/controller/role.controller';

const rolesRoutes = Router();

rolesRoutes.use(authMiddleware);
rolesRoutes.use(RolesMiddleware.admin);

rolesRoutes.get('/', RoleController.fetch);
rolesRoutes.get('/:id', RoleValidator.show, RoleController.show);

export default rolesRoutes;
