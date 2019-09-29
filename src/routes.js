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
import Category from './app/models/Category';

// a classe Router cria manipuladores de rotas modulares e montáveis
const router = new Router();

/**
 * Rotas de Teste
 */
router.get('/user', UserController.getAllUsers);

/**
 *  Rotas publicas
 */

/**
 * Rota para criar um user, recebe id, email, name, password.
 */
router.post('/user/create', UserController.saveToDb);

/**
 * Rota para autenticar e receber um tolken como retorno, recebe email e password.
 */
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

/**
 * Cria uma manifestação, recebe os atributos title, description e categories <- (em forma de array).
 */
router.post(
  '/manifestation/create',
  ManifestationMiddleware.checkBody,
  ManifestationController.saveToDb
);

/**
 * Retorna manifestações baseado em sua requisição, recebe manifestation_id.
 */
router.get('/manifestation', ManifestationController.getAll);
router.post('/manifestation', ManifestationController.getById);

// A daqui serão rotas de Administradores
/**
 * TODO Verificar Role com um middleware aqui e averiguar se é admin
 * passar role como payload no tolken
 */

/**
 * Usada para criar uma categoria, temporaria, será migrada para um controller próprio
 */
router.post('/category', (req, res) => {
  Category.create(req.body);
  res.send('ok');
});
export default router;
