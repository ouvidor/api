import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
      }
    );

    this.addHook('beforeSave', async user => {
      // caso uma senha seja informada
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Manifestation);
    this.belongsToMany(models.Role, {
      through: 'user_role',
      as: 'role',
      foreignKey: 'user_id',
      constraints: false,
    });
  }

  // retorna true caso a senha bata
  checkPassword(passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
  }
}

export default User;
