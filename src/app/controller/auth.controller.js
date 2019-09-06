//const db = require('../../config/database');
const User = require('../models/User');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../config/auth');

class AuthController {

    //Loga e retorna um Tolken
    static async login(req, res) {
        const { login, password } = req.body;

        //procura e pega usuário do banco
        const user = await User.findOne({
            where: { login: req.body.login }
        });

        //caso não exista
        if (!user) {
            return res.status(400).send({ error: "usuário não encontrado" });
        }

        //Checa se a senha está correta
        if (!await Bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({ message: "Senha incorreta" })
        } else {

            const token = jwt.sign({ id: user.id }, auth.secret,
                {
                    expiresIn: auth.expiresIn
                })

            user.password = undefined;
            res.send({ user, token: generateToken(user.id) });
        }
    }
}

//função que gera o token
function generateToken(id) {
    const token = jwt.sign({ id: id }, auth.secret,
        {
            expiresIn: auth.expiresIn
        })
    return token;
};

module.exports = AuthController;