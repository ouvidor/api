import { Router } from 'express';

import UserController from './app/controller/user.controller';
import AuthMiddleware from './app/middlewares/middlewares.auth';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

/**
 * Rotas publicas
 */
router.post('/user/create', UserController.saveToDb);
// TODO rota para criar seção (retorna o perfil do usuário e o token)

/**
 * Middlware de autenticação
 * apartir desse ponto é necessário estar autenticado
 */
router.use(AuthMiddleware.validateToken);

/**
 * Rotas privadas
 * necessário um Token
 */
// TODO rotas privadas

export default router;
