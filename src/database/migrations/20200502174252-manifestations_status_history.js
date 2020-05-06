/**
 * Migration da tabela de categoria
 * Para gerar uma migration similar basta executar o comando:
 * yarn sequelize migration:create --name=manifestations_status_history
 *
 * para rodar a migration para o banco de dados
 * yarn sequelize db:migrate
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'manifestations_status_history',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        manifestations_id: {
          type: Sequelize.INTEGER,
          references: { model: 'manifestations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },
        status_id: {
          type: Sequelize.INTEGER,
          references: { model: 'status', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
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
    return queryInterface.dropTable('manifestations_status_history');
  },
};
