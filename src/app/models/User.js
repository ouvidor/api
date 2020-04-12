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
        role_id: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
          values: [1, 2, 3],
          allowNull: false,
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

    this.addHook('beforeSave', async user => {
      // caso uma senha seja informada
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // retorna true caso a senha bata
  checkPassword(passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
  }
}

export default User;
