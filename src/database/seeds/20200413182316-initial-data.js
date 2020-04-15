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
          role_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'ombudsman',
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
      'prefecture',
      [
        {
          site: 'www.google.com',
          email: 'prefeitura@prefeitura.com',
          attendance: '24 horas por dia, todos os dias',
          location: 'Centro',
          telephone: '(22) 1010-1010',
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
