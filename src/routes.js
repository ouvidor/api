/**
 * Arquivo responsável por expor todas as rotas para a classe App
 */

import { Router } from 'express';
import Multer from 'multer';

// controllers
import UserController from './app/controller/user.controller';
import AuthController from './app/controller/auth.controller';
import ManifestationController from './app/controller/manifestation.controller';
import CategoryController from './app/controller/category.controller';
import TypeController from './app/controller/type.controller';
import StatusController from './app/controller/status.controller';
import RoleController from './app/controller/role.controller';
import SecretaryController from './app/controller/secretary.controller';
import MailController from './app/controller/mail.controller';
import ManifestationStatusHistoryController from './app/controller/manifestationStatusHistory.controller';
import fileController from './app/controller/file.controller';

// middleware usado apenas em Tests
import setupDbInitialData from './app/middlewares/initialDbSetupForTests';

// middlewares de autenticação
import AuthMiddleware from './app/middlewares/auth';
import RolesMiddleware from './app/middlewares/roles';

// validators
import UserValidator from './app/middlewares/validators/User';
import ManifestationValidator from './app/middlewares/validators/Manifestation';
import UserLoginValidator from './app/middlewares/validators/UserLogin';
import GenericValidator from './app/middlewares/validators/Generic';
import RoleValidation from './app/middlewares/validators/Role';
import SecretaryValidator from './app/middlewares/validators/Secretary';
import MailValidator from './app/middlewares/validators/Mail';
import ManifestationStatusHistoryValidor from './app/middlewares/validators/ManifestationStatusHistory';
import FTPValidator from './app/middlewares/validators/FTP';

// configs
import ftpConfig from './config/ftp';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

// multer é usado como middleware nas rotas de Upload relacionadas ao módulo FTP
const upload = Multer(ftpConfig.multerOptions);

// middleware para tests
// esse middleware garante o setup inicial em todo test
if (process.env.NODE_ENV === 'test') {
  router.use(setupDbInitialData);
}

/**
 *  Rotas publicas
 */

router.post('/user', UserValidator.save, UserController.save);
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
router.put('/user/:id', UserValidator.update, UserController.update);

router.get('/category', CategoryController.fetch);
router.get('/category/:id', CategoryController.show);

router.get('/type', TypeController.fetch);
router.get('/type/:id', TypeController.show);

router.get(
  '/manifestation',
  ManifestationValidator.fetch,
  ManifestationController.fetch
);

router.get('/manifestation/:idOrProtocol', ManifestationController.show);

/**
 * Rotas de File/FTP/Upload
 */

router.post('/ftp/upload', upload.single('file'), fileController.upload);
router.get('/ftp/download/:file_id', fileController.download);
router.delete('/ftp/remove/:file_id', fileController.remove);
router.get('/ftp/:manifestation_id', fileController.list);

/**
 * Rotas de Administrador
 */
router.use(RolesMiddleware.admin);

router.get('/role', RoleController.fetch);
router.get('/role/:id', RoleController.show);

router.get('/status', StatusController.fetch);
router.get('/status/:id', StatusController.show);

router.get('/secretary', SecretaryController.fetch);
router.get('/secretary/:id', SecretaryController.show);

router.get('/user', UserController.fetch);
router.get('/user/:id', UserController.show);

router.get(
  '/manifestation/:idOrProtocol/status',
  ManifestationStatusHistoryController.fetch
);
router.get(
  '/manifestation/status/:id',
  ManifestationStatusHistoryController.show
);
router.post(
  '/manifestation/:manifestationId/status',
  ManifestationStatusHistoryValidor.save,
  ManifestationStatusHistoryController.save
);
router.put(
  '/manifestation/status/:id',
  ManifestationStatusHistoryValidor.update,
  ManifestationStatusHistoryController.update
);

router.post('/email', MailValidator, MailController.send);

// A daqui serão rotas de Administradores
/**
 * Rotas de Admin Master
 */
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
