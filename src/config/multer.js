import multer from 'multer';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // destino onde o arquivo será salvo
    destination: resolve(__dirname, '..', '..', 'temp'),
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: process.env.MAX_FILE_SIZE * 1024 },
};
