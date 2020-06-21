module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('secretariats', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('secretariats', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};
