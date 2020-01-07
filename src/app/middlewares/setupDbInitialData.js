import Role from '../models/Role';
import User from '../models/User';
import Type from '../models/Type';

async function setupDbInitialData(req, res, next) {
  try {
    const roles = await Role.findAll();

    if (roles.length === 0) {
      await Role.create({ title: 'master', level: 1 });
      await Role.create({ title: 'admin', level: 2 });
      await Role.create({ title: 'citizen', level: 3 });
    }

    const users = await User.findAll();
    if (users.length === 0) {
      const user = await User.create({
        first_name: 'master',
        last_name: 'root',
        email: 'root@gmail.com',
        password: '123456',
      });

      await user.setRole(await Role.findOne({ where: { title: 'master' } }));
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
}

export default setupDbInitialData;
