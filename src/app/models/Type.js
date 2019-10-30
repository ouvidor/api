/**
 * TIPOS DE MANIFESTAÇÕES
 * exemplo: 'Reclamação', 'Pedido de Informação', 'Elogio'
 */
import Sequelize, { Model } from 'sequelize';

class Type extends Model {
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
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Manifestation, {
      through: 'manifestation_type',
      as: 'manifestation',
      foreignKey: 'type_id',
      constraints: false,
    });
  }
}

export default Type;
