require('dotenv').config();

const Sequelize = require('sequelize');

//retorna uma instancia de conexão
module.exports = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_DOMAIN,
        dialect: 'mysql',
        //logging: false
    });