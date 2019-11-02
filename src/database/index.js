import Sequelize from 'sequelize';

// configuração de acesso ao banco
import databaseConfig from '../config/database';

// importações dos models
import User from '../app/models/User';
import Manifestation from '../app/models/Manifestation';
import ManifestationStatusHistory from '../app/models/ManifestationStatusHistory';
import Category from '../app/models/Category';
import Type from '../app/models/Type';
import Status from '../app/models/Status';
import Role from '../app/models/Role';
import Secretary from '../app/models/Secretary';

require('dotenv');

// a ordem é importante caso queira testar com sync()
const models = [
  User,
  Type,
  Status,
  Secretary,
  Category,
  Role,
  Manifestation,
  ManifestationStatusHistory,
];

class Database {
  constructor() {
    // Aqui é necessário informar se está utilizando as configurações de banco local ou remoto
    this.connection = new Sequelize(databaseConfig);
    this.init();
    this.associate();
    // this.sync();
    this.checkDefaultEntries();
  }

  init() {
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }

  // essa função cria entries iniciais necessárias para o uso
  async checkDefaultEntries() {
    try {
      const roles = await Role.findAll();
      if (roles.length === 0) {
        await Role.create({ title: 'master', level: 1 });
        await Role.create({ title: 'admin', level: 2 });
        await Role.create({ title: 'citizen', level: 3 });
      }

      const users = await User.findAll();
      if (users.length === 0) {
        const user = await User.create({
          first_name: 'master',
          last_name: 'root',
          email: 'root@gmail.com',
          password: '123456',
        });

        user.setRole(await Role.findOne({ where: { title: 'master' } }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * A função sync sincroniza todos os models com a database em uso.
   * ps: somente use {force: true} em ambiente de desenvolvimento sem dados no banco.
   */
  async sync() {
    models.forEach(model => {
      model
        .sync()
        .then(console.log(`Table: ${model.name} Sincronizada ao banco`));
    });
  }
}

export default new Database();
