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
import AuthController from './app/controller/auth.controller';
import AuthMiddleware from './app/middlewares/auth';
import ManifestationController from './app/controller/manifestation.controller';
import CategoryController from './app/controller/category.controller';
import RoleController from './app/controller/role.controller';

// validators
import CreateUserValidator from './app/middlewares/validators/CreateUser';
import CreateManifestationValidator from './app/middlewares/validators/CreateManifestation';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

/**
 * Rotas de Teste
 */
router.get('/user', UserController.getAllUsers);

/**
 *  Rotas publicas
 */

/*
 * TODO: para criar um user definiindo uma role é necessário saber a role, mas ela só é passada
 * após a execução do middleware de autenticação, talvez seja necessário criar uma rota
 * somente para criação de usuários admin
 *
 */

router.post('/user/create', CreateUserValidator, UserController.saveToDb);
router.post('/auth', AuthController.login);

/**
 * Middlware de autenticação
 *
 * Apartir desse ponto é necessário estar autenticado
 * Para ser autenticado deve ser enviado um token na Header da requisição
 * A partir desse ponto se pode ter acesso ao `req.user_id` e `req.user_role` pois foi passado como payload no token.
 */
router.use(AuthMiddleware);

/**
 * Rotas privadas
 * necessário um Token
 */
router.post(
  '/manifestation/create',
  CreateManifestationValidator,
  ManifestationController.saveToDb
);
router.get('/manifestation', ManifestationController.getAll);
router.post('/manifestation', ManifestationController.getById);

// A daqui serão rotas de Administradores
/**
 * TODO Verificar Role com um middleware aqui e averiguar se é admin
 * passar role como payload no token
 */

router.post('/category/create', CategoryController.saveToDb);

// A daqui serão rotas de Administradores MASTER

router.post('/role/create', RoleController.saveToDb);

export default router;
