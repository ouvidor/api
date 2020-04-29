import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import UserValidator from '../app/middlewares/validators/User';
import UserController from '../app/controller/user.controller';

const usersRoutes = Router();

usersRoutes.post('/', UserValidator.save, UserController.save);

usersRoutes.use(authMiddleware);

usersRoutes.get('/', UserController.fetch);
usersRoutes.get('/:id', UserController.show);
usersRoutes.put('/:id', UserValidator.update, UserController.update);

export default usersRoutes;
