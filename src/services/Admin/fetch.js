import { Op } from 'sequelize';
import User from '../../models/User';

import { ADMIN, MASTER } from '../../data/roles';

const fetchAdmins = async () => {
  const admins = await User.findAll({
    attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
    where: {
      role: {
        [Op.or]: [ADMIN, MASTER],
      },
    },
  });

  return admins;
};

export default fetchAdmins;
