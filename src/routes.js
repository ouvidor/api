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
import CategoryController from './app/controller/category.controller';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

/**
 * Rotas de Teste
 */
router.get('/user', UserController.getAllUsers);

/**
 *  Rotas publicas
 */

router.post('/user/create', UserController.saveToDb);

router.post('/auth', AuthController.login);

/**
 * Fim de rotas publicas
 */

/**
 * Middlware de autenticação
 *
 * Apartir desse ponto é necessário estar autenticado
 * Para ser autenticado deve ser enviado um token na Header da requisição
 * A partir desse ponto se pode ter acesso ao 'req.user_id' pois foi passado como payload no tolken.
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

router.get('/manifestation', ManifestationController.getAll);
router.post('/manifestation', ManifestationController.getById);

// A daqui serão rotas de Administradores
/**
 * TODO Verificar Role com um middleware aqui e averiguar se é admin
 * passar role como payload no tolken
 */

router.post('/category/create', CategoryController.saveToDb);
export default router;
