import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_temp: Sequelize.VIRTUAL,
        password: Sequelize.STRING,
      },
      // configs da tabela
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      // caso uma senha seja informada
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
      console.log(user.password);
    });

    return this;
  }

  static associate(models) {
    // User possui um
    // this.hasOne(models.Role);
  }

  // retorna true caso a senha bata
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
