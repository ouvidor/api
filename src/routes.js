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
import ManifestationController from './app/controller/manifestation.controller';
import CategoryController from './app/controller/category.controller';
import TypeController from './app/controller/type.controller';
import StatusController from './app/controller/status.controller';
import RoleController from './app/controller/role.controller';
import SecretaryController from './app/controller/secretary.controller';

// middleware para configurar os dados iniciais do banco
import setupDbInitialData from './app/middlewares/setupDbInitialData';

// middlewares de autenticação
import AuthMiddleware from './app/middlewares/auth';
import RolesMiddleware from './app/middlewares/roles';

// validators
import CreateUserValidator from './app/middlewares/validators/CreateUser';
import ManifestationValidator from './app/middlewares/validators/Manifestation';
import UserLoginValidator from './app/middlewares/validators/UserLogin';
import GenericValidator from './app/middlewares/validators/Generic';
import RoleValidation from './app/middlewares/validators/RoleValidation';
import SecretaryValidator from './app/middlewares/validators/Secretary';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

// middleware para tests
// esse middleware garante o setup inicial em todo test
if (process.env.NODE_ENV === 'test') {
  router.use(setupDbInitialData);
}

/**
 * Rotas de Teste
 */
router.get('/user/:id?*', UserController.fetch);

/**
 *  Rotas publicas
 */

/*
 * TODO: para criar um User definindo uma Role é necessário saber a Role, mas ela só é passada
 * após a execução do middleware de autenticação, talvez seja necessário criar uma rota
 * somente para criação de usuários admin
 */

router.post('/user', CreateUserValidator, UserController.save);
router.post('/auth', UserLoginValidator, AuthController.login);

/**
 * Middlware de autenticação
 *
 * Apartir desse ponto é necessário estar autenticado
 * Para ser autenticado deve ser enviado um token na Header da requisição
 * A partir desse ponto se pode ter acesso ao `req.user_id` e `req.user_roles` pois foi passado como payload no token.
 */
router.use(AuthMiddleware);

/**
 * Rotas privadas
 * necessário um Token
 */
router.post(
  '/manifestation',
  ManifestationValidator.save,
  ManifestationController.save
);
router.put(
  '/manifestation/:id',
  ManifestationValidator.update,
  ManifestationController.update
);

// A partir daqui serão rotas de Administradores
router.use(RolesMiddleware.admin);

router.get('/manifestation/:id?*', ManifestationController.fetch);
router.get('/category/:id?*', CategoryController.fetch);
router.get('/role/:id?*', RoleController.fetch);
router.get('/type/:id?*', TypeController.fetch);
router.get('/status/:id?*', StatusController.fetch);
router.get('/secretary/:id?*', SecretaryController.fetch);

// A partir daqui serão rotas de Administradores Master
router.use(RolesMiddleware.adminMaster);

router.post('/category', GenericValidator.save, CategoryController.save);
router.put('/category/:id', GenericValidator.update, CategoryController.update);
router.delete('/category/:id', CategoryController.delete);

router.post('/role', RoleValidation.save, RoleController.save);
router.put('/role/:id', RoleValidation.update, RoleController.update);
router.delete('/role/:id', RoleController.delete);

router.post('/type', GenericValidator.save, TypeController.save);
router.put('/type/:id', GenericValidator.update, TypeController.update);
router.delete('/type/:id', TypeController.delete);

router.post('/status', GenericValidator.save, StatusController.save);
router.put('/status/:id', GenericValidator.update, StatusController.update);
router.delete('/status/:id', StatusController.delete);

router.post('/secretary', SecretaryValidator.save, SecretaryController.save);
router.put(
  '/secretary/:id',
  SecretaryValidator.update,
  SecretaryController.update
);
router.delete('/secretary/:id', SecretaryController.delete);

export default router;
