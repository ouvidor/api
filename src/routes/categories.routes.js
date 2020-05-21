import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import GenericValidator from '../middlewares/validators/Generic';

import fetchCategories from '../services/Category/fetch';
import showCategory from '../services/Category/show';
import createCategory from '../services/Category/create';
import updateCategory from '../services/Category/update';
import deleteCategory from '../services/Category/delete';

const categoriesRoutes = Router();

categoriesRoutes.use(authMiddleware);

categoriesRoutes.get('/', async (request, response) => {
  const categories = await fetchCategories();

  return response.status(200).json(categories);
});

categoriesRoutes.get('/:id', async (request, response) => {
  const id = Number(request.params.id);

  const category = await showCategory(id);

  return response.status(200).json(category);
});

categoriesRoutes.post('/', GenericValidator.save, async (request, response) => {
  const { title } = request.body;

  const category = await createCategory({ title });

  return response.status(201).json(category);
});

categoriesRoutes.put(
  '/:id',
  GenericValidator.update,
  async (request, response) => {
    const id = Number(request.params.id);
    const { title } = request.body;

    const category = await updateCategory({ id, title });

    return response.status(200).json(category);
  }
);

categoriesRoutes.delete('/:id', async (request, response) => {
  const id = Number(request.params.id);

  const category = await deleteCategory(id);

  return response.status(200).json(category);
});

export default categoriesRoutes;
