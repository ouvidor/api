const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../../config/auth');

class authMiddlewares {
  static async validateToken(req, res, next) {
    // pega o token do header
    const authHeader = req.headers.authorization;

    // checa se é null
    if (!authHeader) {
      return res.status(401).send({ error: 'token não informado' });
    }

    // divide o Bearer e o Token
    const parts = authHeader.split(' ');

    // checa se dividiu corretamente
    if (!parts.legth === 2) {
      return res.status(401).send({ error: 'erro de token' });
    }

    const [scheme, token] = parts;

    // checa formato do token
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).send({ error: 'Token em formato incorreto' });
    }

    // verifica o token
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) return res.status(401).send({ error: 'Token Invalido' });

      req.userId = decoded.id;
      return next();
    });
  }
}

module.exports = authMiddlewares;
