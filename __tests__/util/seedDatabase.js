import User from '../../src/app/models/User';
import Ombudsman from '../../src/app/models/Ombudsman';
import Prefecture from '../../src/app/models/Prefecture';
import Category from '../../src/app/models/Category';

export default async function seedDatabase() {
  // CRIANDO USUARIO MASTER
  const user = await User.create({
    first_name: 'master',
    last_name: 'root',
    email: 'root@gmail.com',
    password: '123456',
    role_id: 3,
  });

  // CRIANDO OUVIDORIA
  const ombudsman = await Ombudsman.create({
    site: 'www.google.com',
    email: 'prefeitura@ouvidoria.com',
    attendance: '24 horas por dia, todos os dias',
    location: 'Centro',
    telephone: '(22) 1111-1111',
  });

  // CRIANDO PREFEITURA
  const prefecture = await Prefecture.create({
    site: 'www.google.com',
    email: 'prefeitura@prefeitura.com',
    attendance: '24 horas por dia, todos os dias',
    location: 'Centro',
    telephone: '(22) 1010-1010',
  });

  const category = await Category.create({
    title: 'Saneamento',
  });

  return {
    user,
    ombudsman,
    prefecture,
    category,
  };
}
