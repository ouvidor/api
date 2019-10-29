import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // pega o token do header
  const authHeader = req.headers.authorization;

  // checa se algum token foi passado
  if (!authHeader) {
    return res.status(401).send({ error: 'Token não informado' });
  }

  const [scheme, token] = authHeader.split(' ');

  // checa se a Header é no formato Bearer
  if (scheme !== 'Bearer') {
    return res.status(401).send({ error: 'Token em formato incorreto' });
  }

  try {
    // transforma o jwt.verify em um método await
    // dessa forma a função vira assincrona, evitando gargalo
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // permite o acesso ao id do usuário apartir daqui
    req.user_id = decoded.id;
    req.user_role = decoded.role;

    // segue para o próximo middleware
    return next();
  } catch (err) {
    // caso o token não passe na validação
    return res.status(401).json({ error: 'Token invalido' });
  }
};
