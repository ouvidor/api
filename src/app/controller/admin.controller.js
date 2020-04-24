import { Op } from 'sequelize';

import User from '../models/User';
import arrayOfRoles, { ADMIN, MASTER } from '../data/roles';

class AdminController {
  async fetch(req, res) {
    const admins = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'role_id'],
      where: {
        role_id: {
          [Op.or]: [ADMIN, MASTER],
        },
      },
    });

    const formattedAdmins = admins.map(admin => ({
      ...admin.dataValues,
      role_id: undefined,
      role: arrayOfRoles.find(role => role.id === admin.role_id),
    }));

    return res.status(200).json(formattedAdmins);
  }
}

export default new AdminController();
