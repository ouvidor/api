// A regra do eslint abaixo é importante
/* eslint-disable prefer-template */
/**
 * Arquivo responsavel por salvar temproariamente a imagem no folder 'temp', e envia-la para um servidor de arquivos remoto.
 *
 * Documentação do modulo FTP -> https://www.npmjs.com/package/ftp
 */

/**
 * TODO: tratar as exceções que essa rota pode ter, a que eu estava vendo é a do tamanho do arquivo
 */

import Multer from 'multer';
import Ftp from 'ftp';
import fs from 'fs';
import ftpConfig from '../../config/ftp';
import User from '../models/User';
import Manifestation from '../models/Manifestation';

/**
 * Funções usadas dentro da classe
 */

function deleteFile(file) {
  fs.unlink(`${process.cwd()}/temp/${file.filename}`, err => {
    if (err) throw err;
  });
}

async function sendToRemoteFileServer(file, manifestation_id) {
  console.log('conectando no ftp...');
  const c = new Ftp();
  await new Promise((resolve, reject) => {
    c.connect(ftpConfig.ftpServerConfig);
    c.on('ready', () => {
      console.log('Conexão estabelecida com sucesso!');

      // Muda o diretório sendo utilizado para tmp que é uma pasta padrão do server ftp escolhido
      c.cwd('tmp', () => {
        console.log('diretório de trabalho alterado para tmp');

        // checa se ja existe um folder para essa manifestação
        c.list((err, list) => {
          console.log('checando list');

          let folderExist = false;
          list.forEach(folder => {
            folderExist = folder.name == manifestation_id;
          });
          // Se o folder não existir é criado
          if (!folderExist) {
            c.mkdir('' + manifestation_id, erro => {
              if (erro) {
                console.log(erro);
                return 500;
              }
            });
            c.cwd('' + manifestation_id, () => {
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
          } else {
            c.cwd('' + manifestation_id, () => {
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
          } // fim se não existir
        });
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
  /**
   *  Funções usadas em rotas
   */

  // Retorna todas entries de Roles no DB
  async upload(req, res) {
    const { manifestation_id } = req.body;
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const manifestation = await Manifestation.findByPk(manifestation_id); // manifestação que irá receber o arquivo

    // checa se essa manifestação existe.
    if (!manifestation) {
      deleteFile(req.file);
      return res.status(500).json({ message: 'manifestação não existe' });
    }

    // checa se um arquivo foi enviado (mudar para validator depois)
    if (!req.file) {
      return res
        .status(500)
        .json({ message: 'Não consta um arquivo na requisição' });
    }

    // Checa se quem fez a requisição é o dono da manifestação ou um administrador
    const onwer = user.dataValues.id === manifestation.dataValues.UserId;
    const user_role = req.user_role[0];

    if (onwer || user_role.title === 'master' || user_role.title === 'admin') {
      const status = await sendToRemoteFileServer(req.file, manifestation_id);
      console.log('enviou req');
      deleteFile(req.file);
      return res.status(status).json({ message: 'ok' });
    }

    deleteFile(req.file);

    return res.status(401).json({
      message:
        'Não autorizado, apenas administradores e criadores da propria manifestação podem enviar anexos para a mesma',
    });
  }
} // fim da classe

export default new FileController();
