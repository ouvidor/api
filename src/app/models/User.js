const Sequelize = require('sequelize');

//importa nossa instancia de db para realizar as conexões
const db = require('../../config/database');

/*
    referencia para criação de model:
    https://sequelize.org/v3/docs/models-definition/
*/
const User = db.define('users', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            autoIncrement: true,
            notEmpty: true       
        } 
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }        
    }
})

/*
    A função Sync verifica se já existe um banco com o nome escolhido como acima,
    caso não exista, cria um banco com o schema especificado, caso exista, não faz nada,
    também é possivel forçar o Sync para que drope o database atual e crie um novo, ex:
        User.sync({force: true});
*/
User.sync();

module.exports = User;