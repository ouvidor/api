const bcrypt = require('bcrypt');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'master',
          last_name: 'root',
          email: 'root@gmail.com',
          password: await bcrypt.hash('123456', 8),
          role: 'master',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    const ombudsmen_id = await queryInterface.bulkInsert(
      'ombudsmen',
      [
        {
          site: 'www.google.com',
          email: 'prefeitura@ouvidoria.com',
          attendance: '24 horas por dia, todos os dias',
          location: 'Centro',
          telephone: '(22) 1111-1111',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'prefectures',
      [
        {
          site: 'www.google.com',
          name: 'Cabo Frio',
          email: 'prefeitura@prefeitura.com',
          attendance: '24 horas por dia, todos os dias',
          location: 'Centro',
          telephone: '(22) 1010-1010',
          ombudsmen_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'categories',
      [
        {
          title: 'Saneamento',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'types',
      [
        {
          title: 'sugestão',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'elogio',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'solicitação',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'reclamação',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'denúncia',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'status',
      [
        {
          title: 'arquivada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'cadastrada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'prorrogada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'resposta intermediária',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'complementada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'encerrada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'encaminhada para outra ouvidoria',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'encaminhada para orgão externo',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async queryInterface => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    await queryInterface.bulkDelete(
      'users',
      [
        {
          first_name: 'master',
        },
      ],
      {}
    );
    await queryInterface.bulkDelete(
      'categories',
      [
        {
          title: 'Saneamento',
        },
      ],
      {}
    );
  },
};
