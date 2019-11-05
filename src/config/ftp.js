/**
 * Config para o cliente FTP
 */
import Multer from 'multer';

require('dotenv').config();

module.exports = {
  ftpServerConfig: {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
  },
  multerOptions: {
    storage: Multer.diskStorage({
      destination(req, file, cb) {
        cb(null, `${process.cwd()}/temp`);
      },
      filename(req, file, cb) {
        const [type, extension] = file.mimetype.split('/');
        cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
      },
    }),
    limits: { fileSize: 8000 * 1024 },
  },
};
