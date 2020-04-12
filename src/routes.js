/**
 * Arquivo responsável por expor todas as rotas para a classe App
 */

import { Router } from 'express';
import multer from 'multer';

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
import FileController from './app/controller/file.controller';
import OmbudsmanController from './app/controller/ombudsman.controller';
import PrefectureController from './app/controller/prefecture.controller';

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
import SecretaryValidator from './app/middlewares/validators/Secretary';
import MailValidator from './app/middlewares/validators/Mail';
import RoleValidator from './app/middlewares/validators/Role';
import FTPValidator from './app/middlewares/validators/FTP';

import ManifestationStatusHistoryValidator from './app/middlewares/validators/ManifestationStatusHistory';
import PrefectureAndOmbudsmanValidator from './app/middlewares/validators/PrefectureAndOmbudsman';

// configs
import multerConfig from './config/multer';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

// multer é usado como middleware nas rotas de Upload relacionadas ao módulo FTP
const upload = multer(multerConfig);

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
 * A partir desse ponto se pode ter acesso ao `req.user_id` e `req.user_role` pois foi passado como payload no token.
 */
router.use(AuthMiddleware);

/**
 * Rotas privadas
 * necessário um Token
 */
router.get('/ombudsman', OmbudsmanController.fetch);
router.get('/prefecture', PrefectureController.fetch);

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

router.post('/files/', upload.single('file'), FileController.save);
router.get('/files/:file_id', FileController.show);
router.delete('/files/:file_id', FileController.delete);
router.get('/manifestation/:manifestation_id/files', FileController.fetch);

/**
 * Rotas de Administrador
 */
router.use(RolesMiddleware.admin);

router.get('/role', RoleController.fetch);
router.get('/role/:id', RoleValidator.show, RoleController.show);

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
  ManifestationStatusHistoryValidator.save,
  ManifestationStatusHistoryController.save
);
router.put(
  '/manifestation/status/:id',
  ManifestationStatusHistoryValidator.update,
  ManifestationStatusHistoryController.update
);

router.post('/email', MailValidator, MailController.send);

// A daqui serão rotas de Administradores
/**
 * Rotas de Admin Master
 */
router.use(RolesMiddleware.adminMaster);

router.put(
  '/ombudsman',
  PrefectureAndOmbudsmanValidator.update,
  OmbudsmanController.update
);
router.put(
  '/prefecture',
  PrefectureAndOmbudsmanValidator.update,
  PrefectureController.update
);

router.post('/category', GenericValidator.save, CategoryController.save);
router.put('/category/:id', GenericValidator.update, CategoryController.update);
router.delete('/category/:id', CategoryController.delete);

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
