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
 *  - Verificar o Remove dos arquivos, tratar algumas exceções, upload e download estão prontos praticamente
 */

import Ftp from 'ftp';
import fs from 'fs';
import ftpConfig from '../../config/ftp';
import User from '../models/User';
import Manifestation from '../models/Manifestation';
import File from '../models/File';

/**
 * Funções usadas dentro da classe
 */

function deleteTempFile(file) {
  fs.unlink(`${process.cwd()}/temp/${file.filename}`, err => {
    if (err) throw err;
  });
}

class FileController {
  /**
   *  Funções usadas em rotas
   */

  // Realiza o upload de um arquivo para o servidor FTP
  async upload(req, res, next) {
    const { manifestation_id } = req.body;
    const { file } = req; // Pega o arquivo que o multer(middleware) tratou e colocou na req
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
    const user_role = req.user_roles[0];

    if (onwer || user_role.title === 'master' || user_role.title === 'admin') {
      // const status = await sendToRemoteFileServer(req.file, manifestation_id);
      // console.log('enviou res');
      // deleteTempFile(req.file);
      // if (status === 500) {
      //   return res.status(status).json({ message: 'erro' });
      // }

      // INICIO DO UPLOAD FTP -----------------

      console.log('conectando no ftp...');
      const c = new Ftp();
      await new Promise((resolve, reject) => {
        c.connect(ftpConfig.ftpServerConfig, err => {
          console.log('aaaaaaaaaaaaaaaaa');
          if (err) {
            console.log('deu merda');
            next(err);
          }
        });
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
                    res
                      .status(500)
                      .send({ message: 'falha ao criar diretório', err });
                  }
                  // Muda o folder para o que foi criado
                  c.cwd('' + manifestation_id, () => {
                    // realiza o upload
                    c.put(
                      '' + process.cwd() + '/temp/' + file.filename,
                      `${file.filename}`,
                      err => {
                        if (err) {
                          res
                            .status(500)
                            .send({ message: 'falha ao realizar upload', err });
                        }
                        c.end();
                        resolve('ok');
                      }
                    );
                  });
                });
              }
              // Se folder existir
              else {
                // Muda o folder para o da requisição
                c.cwd('' + manifestation_id, () => {
                  // realiza o upload
                  c.put(
                    '' + process.cwd() + '/temp/' + file.filename,
                    `${file.filename}`,
                    err => {
                      if (err) {
                        res
                          .status(500)
                          .send({ message: 'falha ao realizar upload', err });
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
      // FIM DO UPLOAD FTP -----------------------

      // Se chegar até aqui quer dizer que o upload do arquivo foi um sucesso, agora salvaremos a referencia no banco com o model File
      try {
        const [type, extension] = req.file.mimetype.split('/');
        const data = {
          file_name: req.file.originalname,
          file_name_in_server: req.file.filename,
          extension,
        };
        const uploaded_file = await File.create(data);
        uploaded_file.setUser(user);
        uploaded_file.setManifestation(manifestation);

        return res.status(200).json({ message: 'ok', uploaded_file });
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

  // Usa a api como proxy e encaminha a stream do arquivod no servidor FTP para o requisitante
  async download(req, res) {
    const { file_id } = req.params;
    const file = await File.findByPk(file_id);
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const onwer = user.dataValues.id === file.dataValues.UserId;
    const user_role = req.user_roles[0];

    console.log(file);

    // checa se File existe
    if (!file) {
      return res.status(500).json({
        message: 'Arquivo não existe',
      });
    }

    // checa se Usuário existe
    if (!user) {
      deleteTempFile(req.file);
      return res.status(500).json({ message: 'usuario não existe' });
    }

    // checa se é dono do arquivo ou um admin
    if (user_role.title !== 'master' || user_role.title !== 'admin') {
      if (!onwer) {
        return res.status(401).json({
          message:
            'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
        });
      }
    }

    // Caso passe nas checagens, segue fluxo normal

    try {
      console.log('conectando no ftp para...');
      const c = new Ftp();
      await new Promise(() => {
        c.connect(ftpConfig.ftpServerConfig);
        c.on('ready', () => {
          console.log('Conexão estabelecida com sucesso!');

          // Muda o diretório sendo utilizado para pasta em que o arquivo se encontra
          c.cwd('tmp/' + file.ManifestationId, err => {
            if (err) throw err;
            console.log(
              'diretório de trabalho alterado para tmp/' + file.ManifestationId
            );
            c.get(file.file_name_in_server, (err, stream) => {
              if (err) throw err;
              /**
               * Caso tu do der certo termina na linha abaixo, a stream do arquivo é encaminhada
               * para quem fez a requisição
               */

              /**
               * O Header abaixo serve para que o nome do arquivo seja definido corretamente remove-lo fara
               * com que a stream de dados seja encaminhada para resposta mas com nome e extensão incorretos
               */

              res.header(
                'Content-Disposition',
                'attachment; filename=' + file.file_name
              );

              console.log('Encaminhando Stream de dados para Resposta....');

              return stream.pipe(res);
            }); // fim do get
          }); // fim do cwd
        }); // fim do on
      }); // fim da promise
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Algo deu errado' }, error);
    }
    return res.status(500).json({
      message: 'Algo deu errado',
      error: 'sem mensagem de erro para exibir',
    });
  }

  // Usa a api como proxy e encaminha a stream do arquivod no servidor FTP para o requisitante
  async remove(req, res) {
    const { file_id } = req.params;
    const file = await File.findByPk(file_id);
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const onwer = user.dataValues.id === file.dataValues.UserId;
    const user_role = req.user_role[0];

    // checa se File existe
    if (!file) {
      return res.status(500).json({
        message: 'Arquivo não existe',
      });
    }

    // checa se Usuário existe
    if (!user) {
      deleteTempFile(req.file);
      return res.status(500).json({ message: 'usuario não existe' });
    }

    // checa se é dono do arquivo ou um admin
    if (user_role.title !== 'master' || user_role.title !== 'admin') {
      if (!onwer) {
        return res.status(401).json({
          message:
            'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
        });
      }
    }

    // Caso passe nas checagens, segue fluxo normal

    try {
      console.log('conectando no ftp...');
      const c = new Ftp();
      await new Promise(() => {
        c.connect(ftpConfig.ftpServerConfig);
        c.on('ready', () => {
          console.log('Conexão estabelecida com sucesso!');

          // Muda o diretório sendo utilizado para pasta em que o arquivo se encontra
          c.cwd('tmp/' + file.ManifestationId, err => {
            if (err) throw err;
            console.log(
              'diretório de trabalho alterado para tmp/' + file.ManifestationId
            );
            c.delete(file.file_name_in_server, err => {
              if (err) throw err;
              // Caso queira deixar o arquivo como anexo para download, usar linha abaixo
              // res.attachment(file.file_name);
              /**
               * Caso tu do der certo termina na linha abaixo, a stream do arquivo é encaminhada
               * para quem fez a requisição
               */

              console.log('Arquivo' + file.file_name_in_server + ' apagado');
              return res
                .status(200)
                .json({ message: 'arquivo apagado com sucesso', file });
            }); // fim do get
          }); // fim do cwd
        }); // fim do on
      }); // fim da promise
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Algo deu errado' }, error);
    }
    return res.status(500).json({
      message: 'Algo deu errado',
      error: 'sem mensagem de erro para exibir',
    });
  }
} // fim da classe

export default new FileController();
