import Sequelize, { Model } from 'sequelize';

class Prefecture extends Model {
  static init(sequelize) {
    super.init(
      {
        location: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        name: {
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
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
        tableName: 'prefectures',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Ombudsman, {
      foreignKey: 'ombudsmen_id',
      as: 'ombudsman',
      targetKey: 'id',
    });
  }
}

export default Prefecture;
