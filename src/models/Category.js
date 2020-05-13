import Sequelize, { Model } from 'sequelize';

class Category extends Model {
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
      through: 'manifestations_categories',
      as: 'manifestation',
      foreignKey: 'categories_id',
      constraints: false,
    });
  }
}

export default Category;
