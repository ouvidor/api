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
import Secretary from '../app/models/Secretary';
import File from '../app/models/File';
import Ombudsman from '../app/models/Ombudsman';
import Prefecture from '../app/models/Prefecture';

require('dotenv');

// a ordem é importante
const models = [
  File,
  User,
  Type,
  Status,
  Secretary,
  Category,
  Manifestation,
  ManifestationStatusHistory,
  Ombudsman,
  Prefecture,
];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);
    this.init();
    this.associate();
    // this.sync();
    if (process.env.NODE_ENV !== 'test') {
      this.checkDefaultEntries();
    }
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
