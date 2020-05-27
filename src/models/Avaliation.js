import Sequelize, { Model } from 'sequelize';

class Avaliation extends Model {
  static init(sequelize) {
    super.init(
      {
        rate: {
          type: Sequelize.INTEGER,
          values: [1, 2, 3, 4, 5],
          allowNull: false,
        },
        description: Sequelize.TEXT,
        reopen: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Manifestation, {
      as: 'manifestation',
      foreignKey: 'manifestations_id',
      targetKey: 'id',
    });
  }
}

export default Avaliation;
