import Sequelize from 'sequelize';

// configuração de acesso ao banco
import databaseConfig from '../config/database';

// importações dos models
import User from '../app/models/User';
import Manifestation from '../app/models/Manifestation';

const models = [User, Manifestation];

class Database {
  constructor() {
    // Aqui é necessário informar se está utilizando as configurações de banco local ou remoto
    this.connection = new Sequelize(databaseConfig);
    this.init();
    this.associate();
    this.sync();
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

  // A função sync sincroniza todos os models com a database em uso.
  // ps: somente use {force: true} em ambiente de desenvolvimento sem dados no banco.
  sync() {
    models.forEach(model => {
      model
        .sync()
        .then(console.log(`Table: ${model.name} Sincronizada ao banco`));
    });
  }
}

export default new Database();
