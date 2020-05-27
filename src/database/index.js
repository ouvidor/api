import Sequelize from 'sequelize';

// configuração de acesso ao banco
import databaseConfig from '../config/database';

// importações dos models
import User from '../models/User';
import Manifestation from '../models/Manifestation';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';
import Category from '../models/Category';
import Secretary from '../models/Secretary';
import File from '../models/File';
import Ombudsman from '../models/Ombudsman';
import Prefecture from '../models/Prefecture';
import Type from '../models/Type';
import Status from '../models/Status';
import Avaliation from '../models/Avaliation';

// a ordem é importante
const models = [
  Type,
  Status,
  File,
  User,
  Secretary,
  Category,
  Manifestation,
  ManifestationStatusHistory,
  Ombudsman,
  Prefecture,
  Avaliation,
];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);
    this.init();
    this.associate();
  }

  init() {
    models.forEach(model => model.init(this.connection));
  }

  async query(queryToRun, options) {
    return this.connection.query(queryToRun, options);
  }

  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
