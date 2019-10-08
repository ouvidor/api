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
  }
}

export default Manifestation;
