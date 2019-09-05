const db = require('../../config/database')
const User = require('../models/User')

class UserController {

    //Retorna todas entries de Users no DB, temporário, somente para teste
    static async getAllUsers(req,res){        
        User.findAll()
            .then(users => {
                console.log(users);
                res.sendStatus(200);
            })
            .catch(err => console.log(err));
    }

    static async saveToDb(req,res){
        res.send("post para salvar");
    }
}

module.exports = UserController;