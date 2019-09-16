/**
 * Arquivo responsável por expor todas as rotas para a classe App
 *
 * Funciona assim:
 *  router.get('caminho da rota', funçãoQueVaiTratarARota)
 *
 * router.get(), router.post(), router.put(), router.delete()
 */
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
 *
 * Apartir desse ponto é necessário estar autenticado
 * Para ser autenticado deve ser enviado um token na Header da requisição
 * Apartir desse ponto se pode ter acesso ao 'req.user_id'
 */
router.use(AuthMiddleware.validateToken);

/**
 * Rotas privadas
 * necessário um Token
 */
// TODO rotas privadas

export default router;
