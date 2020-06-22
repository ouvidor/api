import Sequelize, { Model } from 'sequelize';

class Secretary extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: Sequelize.STRING,
          unique: false,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
        },
        accountable: {
          type: Sequelize.STRING,
        },
      },
      // configs da tabela
      {
        sequelize,
        tableName: 'secretariats',
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Prefecture, {
      foreignKey: 'prefectures_id',
      as: 'prefecture',
      targetKey: 'id',
    });
  }
}

export default Secretary;
