const db = require('../../config/database')
const User = require('../models/User')

class UserController {

    //Retorna todas entries de Users no DB, temporário, !somente para teste!
    static async getAllUsers(req,res){        
        User.findAll()
            .then(users => {
                console.log(users);
                res.sendStatus(200);
            })
            .catch(err => console.log(err));
    }

    static async login(req,res){
        
        res.send();
    }

    static async saveToDb(req,res){
        try {
            let user = new User();
            user.name = req.body.name;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.login = req.body.login;

            //APÓS IMPLEMENTAR JWT E HASH, ALTERAR ISSO ABAIXO
            user.password = req.body.password;

            console.log("teste Model: " + user.name);
            await user.save()
                .then(data =>{
                    res.json(data);
                })              
        } catch (err) {

            //erro caso tente salvar uma entrada de campo unico ja existente
            if(err.name == "SequelizeUniqueConstraintError"){
                console.log("Já existe uma entrada UNICA com esse valor, campo: "
                + err.errors.path);

                res.send("Já existe uma entrada UNICA com esse valor, campo: "
                + err.errors.path);
            }

            //erro geral
            res.json(err);
        }        
    }





}//fim da classe

module.exports = UserController;