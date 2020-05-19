import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';
import RoleValidator from '../middlewares/validators/Role';

import roles from '../data/roles';

const rolesRoutes = Router();

rolesRoutes.use(authMiddleware);
rolesRoutes.use(RolesMiddleware.admin);

rolesRoutes.get('/', async (request, response) => {
  return response.status(200).json(roles);
});

rolesRoutes.get('/:id', RoleValidator.show, async (request, response) => {
  const id = Number(request.params.id);

  /**
   * Regra de negócio
   */
  const roleToShow = roles.find(role => {
    return role.id === id;
  });

  if (!roleToShow) {
    return response.status(400).json({ error: 'Essa Role não existe.' });
  }

  return response.status(200).json(roleToShow);
});

export default rolesRoutes;
