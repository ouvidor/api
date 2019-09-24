/**
 * Migration da tabela de role
 * Para gerar uma migration similar basta executar o comando:
 * yarn sequelize migration:create --name=create-role
 *
 * para rodar a migration para o banco de dados
 * yarn sequelize db:migrate
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Roles');
  },
};
