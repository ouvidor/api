import Sequelize, { Model } from 'sequelize';

class Manifestation extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        read: Sequelize.TINYINT,
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
    this.belongsTo(models.User);
    this.belongsToMany(models.Category, {
      through: 'manifestation_category',
      as: 'categories',
      foreignKey: 'manifestation_id',
      constraints: false,
    });
    this.hasMany(models.File);
  }
}

export default Manifestation;
