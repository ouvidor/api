import { Router } from 'express';

import authMiddleware from '../middlewares/auth';
import GenericValidator from '../middlewares/validators/Generic';
import CategoryController from '../controller/category.controller';

const categoriesRoutes = Router();

categoriesRoutes.use(authMiddleware);

categoriesRoutes.get('/', CategoryController.fetch);
categoriesRoutes.get('/:id', CategoryController.show);

categoriesRoutes.post('/', GenericValidator.save, CategoryController.save);

categoriesRoutes.put(
  '/:id',
  GenericValidator.update,
  CategoryController.update
);

categoriesRoutes.delete('/:id', CategoryController.delete);

export default categoriesRoutes;
