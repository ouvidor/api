/**
 * Migration da tabela de categoria
 * Para gerar uma migration similar basta executar o comando:
 * yarn sequelize migration:create --name=create-type
 *
 * para rodar a migration para o banco de dados
 * yarn sequelize db:migrate
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'secretariats',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        accountable: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        prefectures_id: {
          type: Sequelize.INTEGER,
          references: { model: 'prefectures', key: 'id' },
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
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
    return queryInterface.dropTable('secretariats');
  },
};
