import User from '../../src/app/models/User';
import Ombudsman from '../../src/app/models/Ombudsman';
import Prefecture from '../../src/app/models/Prefecture';
import Category from '../../src/app/models/Category';
import Type from '../../src/app/models/Type';
import Status from '../../src/app/models/Status';

export default async function seedDatabase() {
  // CRIANDO USUARIO MASTER
  const user = await User.create({
    first_name: 'master',
    last_name: 'root',
    email: 'root@gmail.com',
    password: '123456',
    role: 'master',
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
    name: 'Cabo Frio',
    email: 'prefeitura@prefeitura.com',
    attendance: '24 horas por dia, todos os dias',
    location: 'Centro',
    telephone: '(22) 1010-1010',
    ombudsmen_id: ombudsman.id,
  });

  const category = await Category.create({
    title: 'Saneamento',
  });

  const types = await Type.bulkCreate([
    { title: 'sugestão' },
    { title: 'elogio' },
    { title: 'solicitação' },
    { title: 'reclamação' },
    { title: 'denúncia' },
  ]);

  const status = await Status.bulkCreate([
    { title: 'arquivada' },
    { title: 'cadastrada' },
    { title: 'prorrogada' },
    { title: 'resposta intermediária' },
    { title: 'complementada' },
    { title: 'encerrada' },
    { title: 'encaminhada para outra ouvidoria' },
    { title: 'encaminhada para orgão externo' },
  ]);

  return {
    user,
    ombudsman,
    prefecture,
    category,
    types,
    status,
  };
}
