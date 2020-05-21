import { Router } from 'express';

// middlewares de autenticação
import AuthMiddleware from '../middlewares/auth';
import RolesMiddleware from '../middlewares/roles';

import usersRoutes from './users.routes';
import manifestationsRoutes from './manifestations.routes';
import categoriesRoutes from './categories.routes';
import typesRoutes from './types.routes';
import rolesRoutes from './roles.routes';
import statusRoutes from './status.routes';
import secretaryRoutes from './secretary.routes';
import filesRoutes from './files.routes';
import ombudsmanRoutes from './ombudsman.routes';
import prefectureRoutes from './prefecture.routes';
import statisticsRoutes from './statistics.routes';
import mailRoutes from './mail.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

const routes = Router();

routes.use('/auth', authRoutes);

routes.use('/user', usersRoutes);
routes.use('/manifestation', manifestationsRoutes);
routes.use('/category', categoriesRoutes);
routes.use('/type', typesRoutes);
routes.use('/role', rolesRoutes);
routes.use('/status', statusRoutes);
routes.use('/secretary', secretaryRoutes);
routes.use('/files', filesRoutes);
routes.use('/ombudsman', ombudsmanRoutes);
routes.use('/prefecture', prefectureRoutes);
routes.use('/statistics', statisticsRoutes);

routes.use(AuthMiddleware);
routes.use(RolesMiddleware.admin);

routes.use('/email', mailRoutes);

routes.use(RolesMiddleware.adminMaster);

routes.use('/admins', adminRoutes);

export default routes;
