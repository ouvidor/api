import { Op } from 'sequelize';

import User from '../models/User';
import { ADMIN, MASTER } from '../data/roles';

class AdminController {
  async fetch(req, res) {
    const admins = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
      where: {
        role: {
          [Op.or]: [ADMIN, MASTER],
        },
      },
    });

    return res.status(200).json(admins);
  }
}

export default new AdminController();
