import Sequelize, { Model } from 'sequelize';

class Prefecture extends Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
        tableName: 'prefecture',
      }
    );

    return this;
  }
}

export default Prefecture;
