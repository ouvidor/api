import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          unique: true,
        },
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
    this.belongsToMany(models.Manifestation, {
      through: 'manifestation_category',
      as: 'manifestation',
      foreignKey: 'category_id',
      constraints: false,
    });
  }
}

export default Category;
