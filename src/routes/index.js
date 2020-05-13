import { Router } from 'express';

// controllers
import AdminController from '../controller/admin.controller';
import AuthController from '../controller/auth.controller';
import MailController from '../controller/mail.controller';

// middlewares de autenticação
import AuthMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';

// validators
import UserLoginValidator from '../middlewares/validators/UserLogin';
import MailValidator from '../middlewares/validators/Mail';

import usersRoutes from './users.routes';
import manifestationsRoutes from './manifestations.routes';
import categoriesRoutes from './categories.routes';
import typesRoutes from './types.routes';
import rolesRoutes from './roles.routes';
import statusRoutes from './status.routes';
import secretariatsRoutes from './secretariats.routes';
import filesRoutes from './files.routes';
import ombudsmanRoutes from './ombudsman.routes';
import prefectureRoutes from './prefecture.routes';
import statisticsRoutes from './statistics.routes';

const routes = Router();

routes.post('/auth', UserLoginValidator, AuthController.login);

routes.use('/user', usersRoutes);
routes.use('/manifestation', manifestationsRoutes);
routes.use('/category', categoriesRoutes);
routes.use('/type', typesRoutes);
routes.use('/role', rolesRoutes);
routes.use('/status', statusRoutes);
routes.use('/secretary', secretariatsRoutes);
routes.use('/files', filesRoutes);
routes.use('/ombudsman', ombudsmanRoutes);
routes.use('/prefecture', prefectureRoutes);
routes.use('/statistics', statisticsRoutes);

routes.use(AuthMiddleware);
routes.use(RolesMiddleware.admin);

routes.post('/email', MailValidator, MailController.send);

routes.use(RolesMiddleware.adminMaster);

routes.get('/admins', AdminController.fetch);

export default routes;
