module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('prefectures', 'ombudsmen_id', {
      type: Sequelize.INTEGER,
      references: { model: 'ombudsmen', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('prefectures', 'ombudsmen_id', {
      type: Sequelize.INTEGER,
      references: { model: 'ombudsmen', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
