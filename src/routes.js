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
import TypeController from './app/controller/type.controller';
import StatusController from './app/controller/status.controller';
import RoleController from './app/controller/role.controller';

// validators
import CreateUserValidator from './app/middlewares/validators/CreateUser';
import CreateManifestationValidator from './app/middlewares/validators/CreateManifestation';
import UserLoginValidator from './app/middlewares/validators/UserLogin';
import TypeValidator from './app/middlewares/validators/Type';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

/**
 * Rotas de Teste
 */
router.get('/user', UserController.fetchAllUsers);

/**
 *  Rotas publicas
 */

/*
 * TODO: para criar um User definindo uma Role é necessário saber a Role, mas ela só é passada
 * após a execução do middleware de autenticação, talvez seja necessário criar uma rota
 * somente para criação de usuários admin
 */

router.post('/user/create', CreateUserValidator, UserController.save);
router.post('/auth', UserLoginValidator, AuthController.login);

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
  ManifestationController.save
);
router.get('/manifestation/:id?*', ManifestationController.fetch);
router.get('/type/:id?*', TypeController.fetch);
router.get('/status/:id?*', StatusController.fetch);

// A partir daqui serão rotas de Administradores
/**
 * TODO Verificar Role com um middleware aqui e averiguar se é admin
 * passar role como payload no token
 */

// TODO: A partir daqui serão rotas de Administradores MASTER
router.post('/category/create', CategoryController.save);
router.post('/role/create', RoleController.save);
router.post('/type', TypeValidator, TypeController.save);
router.post('/status', TypeValidator, StatusController.save); // usando o TypeValidator por ser a mesma coisa
router.put('/type/:id', TypeValidator, TypeController.update);
router.put('/status/:id', TypeValidator, StatusController.update);
router.delete('/type/:id', TypeController.delete);
router.delete('/status/:id', StatusController.delete);

export default router;
