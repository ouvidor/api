module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'ombudsman',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        telephone: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        site: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        attendance: {
          type: Sequelize.TEXT,
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
    return queryInterface.dropTable('ombudsman');
  },
};
