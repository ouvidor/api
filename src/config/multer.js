import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // destino onde o arquivo será salvo
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        /**
         * recebe um erro como primeiro argumento,
         *  no caso eu já me certifiquei que não terá erro usando o if
         *
         * segundo parametro é o nome gerado para o arquivo
         *
         *  res.toString('hex') torna os 16 bytes em hexadecimal
         *
         *  extname(file.originalname)
         *    para usar apenas a extensão que o arquivo tem
         */
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
