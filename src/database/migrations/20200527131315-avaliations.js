module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'avaliations',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        rate: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        reopen: {
          type: Sequelize.BOOLEAN,
          default: false,
          allowNull: false,
        },
        manifestations_id: {
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
    return queryInterface.dropTable('avaliations');
  },
};
