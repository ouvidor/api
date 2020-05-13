import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import UserValidator from '../middlewares/validators/User';
import UserController from '../controller/user.controller';

const usersRoutes = Router();

usersRoutes.post('/', UserValidator.save, UserController.save);

usersRoutes.use(authMiddleware);

usersRoutes.get('/', UserController.fetch);
usersRoutes.get('/:id', UserController.show);
usersRoutes.put('/:id', UserValidator.update, UserController.update);

export default usersRoutes;
