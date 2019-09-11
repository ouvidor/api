require('dotenv').config(); // this is important!

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_DOMAIN,
    dialect: 'mysql',
    operatorsAliases: false,
  },
};
