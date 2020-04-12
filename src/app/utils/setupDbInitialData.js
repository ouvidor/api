import User from '../models/User';
import Ombudsman from '../models/Ombudsman';
import Prefecture from '../models/Prefecture';

export default async function setupDbInitialData() {
  // CRIANDO USUARIO MASTER
  const users = await User.findAll();
  if (users.length === 0) {
    await User.create({
      first_name: 'master',
      last_name: 'root',
      email: 'root@gmail.com',
      password: '123456',
      role_id: 3,
    });
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
