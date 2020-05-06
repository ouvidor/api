/**
 * Migration da tabela relacional de categorias e manifestations
 * Para gerar uma migration similar basta executar o comando:
 * yarn sequelize migration:create --name=create-user
 *
 * para rodar a migration para o banco de dados
 * yarn sequelize db:migrate
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'manifestations_categories',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        manifestations_id: {
          type: Sequelize.INTEGER,
          references: { model: 'manifestations', key: 'id' },
          onDelete: 'CASCADE',
        },
        categories_id: {
          type: Sequelize.INTEGER,
          references: { model: 'categories', key: 'id' },
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
    return queryInterface.dropTable('manifestations_categories');
  },
};
