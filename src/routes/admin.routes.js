import { Router } from 'express';

import fetchAdmins from '../services/Admin/fetch';
import changeAdminRole from '../services/Admin/changeAdminRole';

const adminRoutes = Router();

adminRoutes.get('/', async (request, response) => {
  const admins = await fetchAdmins();

  return response.status(200).json(admins);
});

adminRoutes.patch('/:id', async (request, response) => {
  const id = Number(request.params.id);
  const { admin } = request.body;

  await changeAdminRole({
    id,
    adminRole: admin,
  });

  return response.status(204).json();
});

export default adminRoutes;
