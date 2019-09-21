require('../bootstrap');
/**
 * configuração de comunicação com o banco de dados
 */

const env = {
  development: {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_DOMAIN,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    storage: './__tests__/database.sqlite',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
  local: {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    database: 'ouvidor',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};

module.exports = env.local;
