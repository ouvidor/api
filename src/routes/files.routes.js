import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../config/multer';
import authMiddleware from '../app/middlewares/auth';
import FileValidator from '../app/middlewares/validators/File';
import FileController from '../app/controller/file.controller';

const filesRoutes = Router();

// o multer faz as tratativas necessárias para utilizarmos upload
const upload = multer(multerConfig);

filesRoutes.use(authMiddleware);

filesRoutes.get('/manifestation/:manifestation_id', FileController.fetch);
filesRoutes.get('/:file_id', FileValidator.show, FileController.show);
filesRoutes.post(
  '/',
  upload.array('file'),
  FileValidator.save,
  FileController.save
);
filesRoutes.delete('/:file_id', FileController.delete);

export default filesRoutes;
