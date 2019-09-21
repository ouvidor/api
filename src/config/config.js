require('dotenv').config(); // this is important!

const env = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_DOMAIN,
    dialect: 'mysql',
    operatorsAliases: false,
  },
  local: {
    username: 'root',
    password: 'root',
    database: 'ouvidor',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
  },
};

module.exports = env.local;
