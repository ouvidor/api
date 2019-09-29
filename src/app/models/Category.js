import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
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
      as: 'manifesteations',
      foreignKey: 'category_id',
      constraints: false,
    });
  }
}

export default Category;
