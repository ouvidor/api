import Sequelize from 'sequelize';

// configuração de acesso ao banco
import databaseConfig from '../config/database';

// importações dos models
import User from '../app/models/User';
import Manifestation from '../app/models/Manifestation';
import ManifestationStatusHistory from '../app/models/ManifestationStatusHistory';
import Category from '../app/models/Category';
import Secretary from '../app/models/Secretary';
import File from '../app/models/File';
import Ombudsman from '../app/models/Ombudsman';
import Prefecture from '../app/models/Prefecture';

require('dotenv');

// a ordem é importante
const models = [
  File,
  User,
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
}

export default new Database();
