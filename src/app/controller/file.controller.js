// A regra do eslint abaixo é importante
/* eslint-disable prefer-template */
/**
 * Arquivo responsavel por salvar temproariamente a imagem no folder 'temp', e envia-la para um servidor de arquivos remoto.
 *
 * Documentação do modulo FTP -> https://www.npmjs.com/package/ftp
 */

import Multer from 'multer';
import Ftp from 'ftp';
import fs from 'fs';
import ftpConfig from '../../config/ftp';
import User from '../models/User';
import Manifestation from '../models/Manifestation';
import { isBuffer } from 'util';

function deleteFile(file) {
  fs.unlink(`${process.cwd()}/temp/${file.filename}`, err => {
    if (err) throw err;
  });
}

async function sendToRemoteFileServer(file, manifestation_id) {
  console.log('conectando no ftp...');
  const c = new Ftp();
  await new Promise((resolve, reject) => {
    c.connect(ftpConfig);
    c.on('ready', () => {
      console.log('Conexão estabelecida com sucesso!');

      // Muda o diretório sendo utilizado
      c.cwd('tmp', () => {
        console.log('diretório de trabalho alterado para tmp');
      });

      // checa se ja existe um folder para essa manifestação
      c.list((err, list) => {
        let folderExist = false;
        list.forEach(folder => {
          folderExist = folder.name == manifestation_id ? true : false;
        });
        if (!folderExist) {
          c.mkdir('' + manifestation_id, erro => {
            if (erro) {
              console.log(erro);
              return 500;
            }
            c.cwd('' + manifestation_id, () => {
              // console.log('folder alterado para: ' + c.pwd());
              c.put(
                '' + process.cwd() + '/temp/' + file.filename,
                `${file.filename}`,
                err => {
                  if (err) {
                    return 500;
                  }
                  c.end();
                  resolve('ok');
                }
              );
            });
          });
        } // fim se não existir
      });
    });
    c.on('error', err => {
      console.log(err);
      reject(err);
    });
  });
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
    // TODO alterar o funcionamento de checagem de role pois o pedro alterou na master
    const { manifestation_id } = req.body;
    const user = await User.findByPk(req.user_id);
    const manifestation = await Manifestation.findByPk(manifestation_id);

    // console.log(user.dataValues.id);
    // console.log(manifestation.dataValues.UserId);

    // Checa se quem fez a requisição é o dono da manifestação.
    const onwer =
      user.dataValues.id === manifestation.dataValues.UserId ? true : false;
    const user_role = req.user_role[0];

    if (onwer || user_role.title === 'master') {
      const status = await sendToRemoteFileServer(req.file, manifestation_id);
      console.log('enviou req');
      deleteFile(req.file);
      return res.status(status).send('ok');
    }
    return res
      .status(401)
      .send('Não autorizado, cheque o token e permissões do seu usuário');
  }
} // fim da classe

export default new FileController();
