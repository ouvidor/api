import Sequelize, { Model } from 'sequelize';

class Status extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: Sequelize.STRING,
          unique: true,
        },
      },
      // configs da tabela
      {
        sequelize,
        modelName: 'Status',
        tableName: 'status',
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
      }
    );

    return this;
  }
}

export default Status;
