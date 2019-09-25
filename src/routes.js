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
import AuthController from './app/controller/auth.controller';
import AuthMiddleware from './app/middlewares/auth';
import ManifestationMiddleware from './app/middlewares/manifestation.middleware';
import ManifestationController from './app/controller/manifestation.controller';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

/**
 * Rotas de Teste
 */
router.get('/user', UserController.getAllUsers);
// const decoded = jwt.verify(req.body.token, process.env.AUTH_SECRET);

/**
 * Rotas publicas
 */

router.post('/user/create', UserController.saveToDb);

router.post('/auth', AuthController.login);

// TODO rota para criar seção (retorna o perfil do usuário e o token)

/**
 * Middlware de autenticação
 *
 * Apartir desse ponto é necessário estar autenticado
 * Para ser autenticado deve ser enviado um token na Header da requisição
 * Apartir desse ponto se pode ter acesso ao 'req.user_id'
 */
router.use(AuthMiddleware);

/**
 * Rotas privadas
 * necessário um Token
 */

router.post(
  '/manifestation/create',
  ManifestationMiddleware.checkBody,
  ManifestationController.saveToDb
);

// TODO rotas privadas

export default router;
