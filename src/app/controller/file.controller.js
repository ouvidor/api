// A regra do eslint abaixo é importante
/* eslint-disable prefer-template */
/**
 * Arquivo responsavel por salvar temproariamente a imagem no folder 'temp', e envia-la para um servidor de arquivos remoto.
 *
 * Documentação do modulo FTP -> https://www.npmjs.com/package/ftp
 */

/**
 * TODO:
 *  - Limitar a quantidade de arquivos que uma manifestação pode ter.
 *  - Filtrar os mimetype.
 */

import Ftp from 'ftp';
import fs from 'fs';
import ftpConfig from '../../config/ftp';
import User from '../models/User';
import Manifestation from '../models/Manifestation';
import File from '../models/File';
import { restElement } from '@babel/types';

/**
 * Funções usadas dentro da classe
 */

function deleteTempFile(file) {
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
            folderExist = folder.name === manifestation_id;
          });
          // Se o folder não existir é criado
          if (!folderExist) {
            c.mkdir('' + manifestation_id, err => {
              if (err) {
                console.log(err);
                return 500;
              }
              // Muda o folder para o que foi criado
              c.cwd('' + manifestation_id, () => {
                // realiza o upload
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
          } else {
            // Muda o folder para o que foi criado
            c.cwd('' + manifestation_id, () => {
              // realiza o upload
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
      deleteTempFile(req.file);
      return res.status(500).json({ message: 'manifestação não existe' });
    }

    // checa se Usuário existe
    if (!user) {
      deleteTempFile(req.file);
      return res.status(500).json({ message: 'usuario não existe' });
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
      console.log('enviou res');
      deleteTempFile(req.file);
      if (status === 500) {
        return res.status(status).json({ message: 'erro' });
      }

      // Se chegar até aqui quer dizer que o upload do arquivo foi um sucesso, agora salvaremos a referencia no banco com o model File
      try {
        const [type, extension] = req.file.mimetype.split('/');
        const data = {
          file_name: req.file.originalname,
          file_name_in_server: req.file.filename,
          extension,
        };
        const file = await File.create(data);
        file.setUser(user);
        file.setManifestation(manifestation);

        return res.status(200).json({ message: 'ok', file });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro', error });
      }
    }

    deleteTempFile(req.file);

    return res.status(401).json({
      message:
        'Não autorizado, apenas administradores e criadores da propria manifestação podem enviar anexos para a mesma',
    });
  }

  // Faz um download usando a api como proxy
  async download(req, res) {
    const { file_id } = req.params;
    const file = await File.findByPk(file_id);
    if (!file) {
      return res.status(401).json({
        message: 'Arquivo não existe',
      });
    }
    try {
      console.log('conectando no ftp...');
      const c = new Ftp();
      await new Promise((resolve, reject) => {
        c.connect(ftpConfig.ftpServerConfig);
        c.on('ready', () => {
          console.log('Conexão estabelecida com sucesso!');

          // Muda o diretório sendo utilizado para pasta em que o arquivo se encontra
          c.cwd('tmp/' + file.ManifestationId, err => {
            if (err) throw err;
            console.log('diretório de trabalho alterado para tmp/' + file.id);
            c.get(file.file_name_in_server, (err, stream) => {
              if (err) throw err;
              res.attachment(file.file_name);
              stream.pipe(res);
            }); // fim do get
          }); // fim do cwd
        }); // fim do on
      }); // fim da promise
    } catch (error) {
      return res.send(error);
    }

    return res.send(file);
  }
} // fim da classe

export default new FileController();
