import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';

// Checka se a requisição foi feita por um admin e retorna um boolean
const checkIfMasterRole = async authHeader => {
  if (!authHeader) {
    return false;
  }

  const [schema, token] = authHeader.split(' ');

  // checa se a Header é no formato Bearer
  if (schema !== 'Bearer') {
    return false;
  }

  const decoded = await promisify(jwt.verify)(token, authConfig.secret);

  return decoded.role === 'master';
};

export default checkIfMasterRole;
