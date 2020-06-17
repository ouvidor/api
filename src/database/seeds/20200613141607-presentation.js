const bcrypt = require('bcrypt');

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.bulkInsert(
        'users',
        [
          {
            first_name: 'josé',
            last_name: 'alfonso',
            email: 'josé@alfonso.com',
            password: await bcrypt.hash('123456', 8),
            role: 'citizen',
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
          },
          {
            first_name: 'adhemir',
            last_name: 'costa',
            email: 'adhemir@costa.com',
            password: await bcrypt.hash('123456', 8),
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
          },
        ],
        {}
      );

      const ombudsman_id = await queryInterface.bulkInsert(
        'ombudsmen',
        [
          {
            site: 'www.eouv.com',
            email: 'arraial@eouv.br',
            attendance: '24 horas por dia, todos os dias',
            location: 'Centro',
            telephone: '(22) 1111-1111',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      );

      const prefecture_id = await queryInterface.bulkInsert(
        'prefectures',
        [
          {
            site: 'www.arraial.com',
            name: 'Arraial',
            email: 'contato@arraial.com',
            attendance: '24 horas por dia, todos os dias',
            location: 'Centro',
            telephone: '(22) 1010-1010',
            ombudsmen_id: ombudsman_id,
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
            title: 'Segurança',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: 'Ambiental',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: 'Documentação',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: 'Mobilidade',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: 'Ordem pública',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      );

      await queryInterface.bulkInsert(
        'secretariats',
        [
          {
            title: 'Secretaria de Saúde',
            email: 'saude@cabofrio.com.br',
            accountable: 'Geovanna Tavares',
            prefectures_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: 'Secretaria de pesca',
            email: 'pesca@cabofrio.com.br',
            accountable: 'Higor Manoel',
            prefectures_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: 'Secretaria de Saúde de Arraial',
            email: 'saude@arraial.com.br',
            accountable: 'Mario Augusto',
            prefectures_id: prefecture_id,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            title: 'Secretaria de pesca de Arraial',
            email: 'pesca@arraial.com.br',
            accountable: 'Siuan Sanche',
            prefectures_id: prefecture_id,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      );
    } catch (error) {
      console.log(error);
    }
  },

  down: async () => {},
};
