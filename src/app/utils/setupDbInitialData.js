import User from '../models/User';
import Role from '../models/Role';
import Ombudsman from '../models/Ombudsman';
import Prefecture from '../models/Prefecture';

export default async function setupDbInitialData() {
  // CRIANDO ROLES
  const roles = await Role.findAll();

  if (roles.length === 0) {
    await Role.create({ title: 'master', level: 1 });
    await Role.create({ title: 'admin', level: 2 });
    await Role.create({ title: 'citizen', level: 3 });
  }

  // CRIANDO USUARIO MASTER
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

  // CRIANDO OUVIDORIA
  const [ombudsman] = await Ombudsman.findAll();
  if (!ombudsman) {
    await Ombudsman.create({
      site: 'www.google.com',
      email: 'prefeitura@ouvidoria.com',
      attendance: '24 horas por dia, todos os dias',
      location: 'Centro',
      telephone: '(22) 1111-1111',
    });
  }

  // CRIANDO PREFEITURA
  const [prefecture] = await Prefecture.findAll();
  if (!prefecture) {
    await Prefecture.create({
      site: 'www.google.com',
      email: 'prefeitura@prefeitura.com',
      attendance: '24 horas por dia, todos os dias',
      location: 'Centro',
      telephone: '(22) 1010-1010',
    });
  }
}
