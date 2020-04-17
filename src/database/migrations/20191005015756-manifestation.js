/**
 * Migration da tabela de manifestation
 * Para gerar uma migration similar basta executar o comando:
 * yarn sequelize migration:create --name=create-user
 *
 * para rodar a migration para o banco de dados
 * yarn sequelize db:migrate
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'manifestations',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        protocol: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        latitude: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        longitude: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        read: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onDelete: 'CASCADE',
          allowNull: false,
        },
        type_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        secretary_id: {
          type: Sequelize.INTEGER,
          references: { model: 'secretariats', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      { underscored: true }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('manifestations');
  },
};
