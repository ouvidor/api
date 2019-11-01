/**
 * Arquivo responsavel por salvar temproariamente a imagem no folder 'temp', e envia-la para um servidor de arquivos remoto.
 *
 * Documentação do modulo FTP -> https://www.npmjs.com/package/ftp
 */

import Multer from 'multer';
import Ftp from 'ftp';
import fs from 'fs';
import ftpConfig from '../../config/ftp';

function deleteFile(file) {
  fs.unlink(`${process.cwd()}/temp/${file.filename}`, err => {
    if (err) throw err;
  });
}

async function sendToRemoteFileServer(file) {
  console.log('conectando no ftp');
  const c = new Ftp();
  await new Promise((resolve, reject) => {
    c.connect(ftpConfig);
    c.on('ready', () => {
      // ess.cwd()}/temp/${file.filename}`);
      c.put(
        // importante ignorar a regra abaixo
        // eslint-disable-next-line prefer-template
        '' + process.cwd() + '/temp/' + file.filename,
        `tmp/teste/${file.filename}`,
        err => {
          if (err) {
            return 500;
          }
          c.end();
          return 200;
        }
      );
      resolve('ok');
    });
    c.on('error', err => {
      console.log(err);
      reject(err);
    });
  });
  console.log('premissa retornou');
  return 200;
}

class FileController {
  createDiskStorage() {
    const storage = Multer.diskStorage({
      destination(req, file, cb) {
        cb(null, `${process.cwd()}/temp`);
      },
      filename(req, file, cb) {
        const [type, extension] = file.mimetype.split('/');

        cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
      },
    });
    return storage;
  }

  // Retorna todas entries de Roles no DB
  async upload(req, res) {
    const status = await sendToRemoteFileServer(req.file);
    console.log('enviou req');
    deleteFile(req.file);
    res.status(status).send('ok');
  }
} // fim da classe

export default new FileController();
