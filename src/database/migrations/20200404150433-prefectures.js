module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'prefectures',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
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
        ombudsmen_id: {
          type: Sequelize.INTEGER,
          references: { model: 'ombudsmen', key: 'id' },
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
    return queryInterface.dropTable('prefectures');
  },
};
