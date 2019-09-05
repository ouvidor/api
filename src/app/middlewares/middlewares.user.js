const Bcrypt = require('bcrypt')
const User = require('../models/User')

    class userMiddlewares{
        static async bcryptUserData(req, res, next) {
            req.body.password = await Bcrypt.hashSync(req.body.password, 10);
            next();
        }

        static async validateHashPassword(req, res, next){
            try{                
                var user = await User.findOne({
                    where: {login: req.body.login}
                });
                
                //se o usuário não existir
                if(!user){
                    return res.send({ message: "O Login não existe" });
                }

                //se existir e a senha estiver correta
                if(Bcrypt.compareSync(req.body.password, user.password)){
                    //TODO retornar um tolken
                    return res.send({ message: "Login efetuado"})
                }else{
                    return res.send({ message: "Senha incorreta"})
                }
            }catch(err){
                console.log(err);
            }
        }
    }

    module.exports = userMiddlewares;
