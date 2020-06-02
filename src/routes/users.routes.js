import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import UserValidator from '../middlewares/validators/User';

import searchUser from '../services/User/search';
import fetchUsers from '../services/User/fetch';
import showUser from '../services/User/show';
import createUser from '../services/User/create';
import updateUser from '../services/User/update';
import deleteUser from '../services/User/delete';

const usersRoutes = Router();

usersRoutes.post('/', UserValidator.save, async (request, response) => {
  const { first_name, last_name, email, role } = request.body;
  const password = String(request.body.password);

  const authorizationHeader = request.headers.authorization;

  const user = await createUser({
    first_name,
    last_name,
    email,
    password,
    role,
    token: authorizationHeader,
  });

  delete user.dataValues.password;

  return response.status(201).json(user);
});

usersRoutes.use(authMiddleware);

usersRoutes.get('/search', async (request, response) => {
  const { email } = request.query;

  const user = await searchUser({ email });

  return response.status(200).json(user);
});

usersRoutes.get('/', async (request, response) => {
  const users = await fetchUsers();

  return response.status(200).json(users);
});

usersRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;

  const user = await showUser(id);

  return response.status(200).json(user);
});

usersRoutes.put('/:id', UserValidator.update, async (request, response) => {
  const {
    first_name,
    last_name,
    email,
    password,
    oldPassword,
    role,
  } = request.body;
  const { id } = request.params;
  const authorizationHeader = request.headers.authorization;

  const user = await updateUser({
    id,
    email,
    first_name,
    last_name,
    password,
    oldPassword,
    role,
    token: authorizationHeader,
  });

  delete user.dataValues.password;

  return response.status(200).json(user);
});

usersRoutes.delete('/:id', async (request, response) => {
  const id = Number(request.params.id);
  const { user_id } = request;

  await deleteUser({
    id,
    userId: user_id,
  });

  return response.status(204).send();
});

export default usersRoutes;
