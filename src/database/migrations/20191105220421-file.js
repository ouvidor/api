/**
 * Migration da tabela de files
 * Para gerar uma migration similar basta executar o comando:
 * yarn sequelize migration:create --name=create-user
 *
 * para rodar a migration para o banco de dados
 * yarn sequelize db:migrate
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'files',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        file_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        file_name_in_server: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        extension: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onDelete: 'CASCADE',
        },
        manifestation_id: {
          type: Sequelize.INTEGER,
          references: { model: 'manifestations', key: 'id' },
          onDelete: 'CASCADE',
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
    return queryInterface.dropTable('users');
  },
};
