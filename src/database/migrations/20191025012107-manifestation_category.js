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
    return queryInterface.createTable('manifestation_category', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      manifestation_id: {
        type: Sequelize.INTEGER,
        references: { model: 'manifestations', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'categories', key: 'id' },
        allowNull: false,
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
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('manifestation_category');
  },
};
