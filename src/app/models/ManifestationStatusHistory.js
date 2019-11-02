import Sequelize, { Model } from 'sequelize';

class ManifestationStatusHistory extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: Sequelize.STRING,
          unique: true,
        },
        description: {
          type: Sequelize.TEXT,
          unique: true,
        },
      },
      // configs da tabela
      {
        sequelize,
        modelName: 'ManifestationStatusHistory',
        tableName: 'manifestation_status_history',
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
      }
    );

    return this;
  }

  // static associate(models) {
  //   this.hasMany(models.Status);
  //   this.hasOne(models.Manifestation, {
  //     foreignKey: 'manifestation_id',
  //   });
  // }
}

export default ManifestationStatusHistory;
