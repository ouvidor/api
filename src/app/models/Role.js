import Sequelize, { Model } from 'sequelize';

class Role extends Model {
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
    this.belongsToMany(models.User, {
      through: 'user_role',
      as: 'user',
      foreignKey: 'role_id',
      constraints: false,
    });
  }
}

export default Role;
