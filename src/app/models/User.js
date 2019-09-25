import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        passwordTemp: Sequelize.VIRTUAL,
        password: Sequelize.STRING,
      },
      // configs da tabela
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      // caso uma senha seja informada
      if (user.passwordTemp) {
        user.password = await bcrypt.hash(user.passwordTemp, 8);
      }
    });

    return this;
  }

  // static associate(models) {
  //   // User possui um
  //   // this.hasOne(models.Role);
  // }

  // retorna true caso a senha bata
  checkPassword(passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
  }
}

export default User;
