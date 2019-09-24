// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Role = sequelize.define('Role', {
//     name: DataTypes.STRING
//   }, {});
//   Role.associate = function(models) {
//     // associations can be defined here
//   };
//   return Role;
// };

import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class Role extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      // configs da tabela
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    // Role pertece a um ou varios User
    // this.belongsToMany(models.User);
  }

  // retorna true caso a senha bata
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Role;
