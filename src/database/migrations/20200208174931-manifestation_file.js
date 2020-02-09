/**
 * Migration da tabela relacional de manifestations e files
 * Para gerar uma migration similar basta executar o comando:
 * yarn sequelize migration:create --name=manifestation_file
 *
 * para rodar a migration para o banco de dados
 * yarn sequelize db:migrate
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'manifestation_file',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        manifestation_id: {
          type: Sequelize.INTEGER,
          references: { model: 'manifestations', key: 'id' },
          onDelete: 'CASCADE',
        },
        file_id: {
          type: Sequelize.INTEGER,
          references: { model: 'files', key: 'id' },
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
    return queryInterface.dropTable('manifestation_file');
  },
};
