import { Op } from 'sequelize';
import { Router } from 'express';

import { ADMIN, MASTER } from '../data/roles';
import User from '../models/User';

const adminRoutes = Router();

adminRoutes.get('/', async (request, response) => {
  const admins = await User.findAll({
    attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
    where: {
      role: {
        [Op.or]: [ADMIN, MASTER],
      },
    },
  });

  return response.status(200).json(admins);
});

export default adminRoutes;
