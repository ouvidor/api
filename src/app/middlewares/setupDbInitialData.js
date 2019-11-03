import Role from '../models/Role';
import User from '../models/User';

async function setupDbInitialData(req, res, next) {
  try {
    const roles = await Role.findAll();

    if (roles.length === 0) {
      await Role.create({ title: 'master', level: 1 });
      await Role.create({ title: 'admin', level: 2 });
      await Role.create({ title: 'citizen', level: 3 });
    }

    const users = await User.findAll({ limit: 1 });
    if (users.length === 0) {
      const user = await User.create({
        first_name: 'master',
        last_name: 'root',
        email: 'root@gmail.com',
        password: '123456',
      });

      const masterRole = await Role.findOne({ where: { title: 'master' } });
      user.setRole(masterRole);
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno na hora de criar os dados iniciais do banco',
    });
  }
}

export default setupDbInitialData;