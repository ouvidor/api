import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        preferedName: Sequelize.STRING,
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
  }

  // retorna true caso a senha bata
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
