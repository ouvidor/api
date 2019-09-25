require('../bootstrap');
/**
 * configuração de comunicação com o banco de dados
 */

module.exports = {
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_DOMAIN,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  storage: './__tests__/database.sqlite',
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
    underscoredAll: false,
  },
};
