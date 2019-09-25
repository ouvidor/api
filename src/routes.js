/**
 * Arquivo responsável por expor todas as rotas para a classe App
 *
 * Funciona assim:
 *  router.get('caminho da rota', funçãoQueVaiTratarARota)
 *
 * router.get(), router.post(), router.put(), router.delete()
 */
import { Router } from 'express';

// controllers
import UserController from './app/controller/user.controller';
import AuthMiddleware from './app/middlewares/auth';

// validators
import CreateUserValidator from './app/middlewares/validators/CreateUser';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

/**
 * Rotas publicas
 */
router.get('/user', UserController.getAllUsers);
router.post('/user/create', CreateUserValidator, UserController.saveToDb);
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
// TODO rotas privadas

export default router;