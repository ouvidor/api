/**
 * Model para a tabela manifestation_status_history
 * Responsável por guardar o historico de status das manifestações
 */
import Sequelize, { Model } from 'sequelize';

class ManifestationStatusHistory extends Model {
  static init(sequelize) {
    super.init(
      {
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

  static associate(models) {
    this.belongsTo(models.Status, {
      foreignKey: 'status_id',
      as: 'status',
      targetKey: 'id',
    });
    this.belongsTo(models.Manifestation, {
      foreignKey: 'manifestation_id',
      as: 'manifestation',
      targetKey: 'id',
    });
    this.belongsTo(models.Secretary, {
      foreignKey: 'secretary_id',
      as: 'secretary',
      targetKey: 'id',
    });
  }
}

export default ManifestationStatusHistory;
