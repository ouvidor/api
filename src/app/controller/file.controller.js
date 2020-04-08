// A regra do eslint abaixo é importante
/* eslint-disable prefer-template */
/**
 * Arquivo responsavel por salvar temproariamente a imagem no folder 'temp', e envia-la para um servidor de arquivos remoto através de FTP.
 *
 * Documentação do modulo FTP -> https://www.npmjs.com/package/ftp
 */

/**
 * TODO:
 *  - Limitar a quantidade de arquivos que uma manifestação pode ter.
 *  - Filtrar os arquivos por extensão (escolher quais tipos de arquivos podem ser enviados).
 *  - Verificar o Remove dos arquivos, tratar algumas exceções, upload e download estão prontos praticamente
 */

import Ftp from 'ftp';
import fileSystem from 'fs';
import { extname } from 'path';

import ftpConfig from '../../config/ftp';
import User from '../models/User';
import Manifestation from '../models/Manifestation';
import File from '../models/File';

/**
 * Funções usadas dentro da classe
 */

// Deleta o arquivo criado temporariamente na pasta temp, é importante que essa função seja
// chamada sempre que um upload terminar pois limpa o cache local do folder da apliucação.
function deleteTempFile(file) {
  if (file) {
    fileSystem.unlink(`${process.cwd()}/temp/${file.filename}`, error => {
      if (error) throw error;
      console.log(`Arquivo ${file.filename} deletado!`);
    });
  }
}

async function deleteFileFromDatabase(id) {
  const file = await File.findByPk(id);
  file.destroy();
}

class FileController {
  /**
   *  Funções usadas em rotas
   */

  // Realiza o upload de um arquivo para o servidor FTP
  async save(req, res, next) {
    console.log('upload');
    const { manifestation_id } = req.body;
    const { file } = req; // Pega o arquivo que o multer(middleware) tratou e colocou na req
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const manifestation = await Manifestation.findByPk(manifestation_id); // manifestação que irá receber o arquivo

    // checa se essa manifestação existe.
    if (!manifestation) {
      deleteTempFile(req.file);
      return res.status(404).json({ message: 'manifestação não existe' });
    }

    // checa se Usuário existe
    if (!user) {
      deleteTempFile(req.file);
      return res.status(500).json({ message: 'usuario não existe' });
    }

    // checa se um arquivo foi enviado
    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'Não consta um arquivo na requisição' });
    }

    // Checa se quem fez a requisição é o dono da manifestação ou um administrador
    const onwer = user.dataValues.id === manifestation.dataValues.user_id;
    const user_role = req.user_roles[0];

    if (onwer || user_role.title === 'master' || user_role.title === 'admin') {
      // INICIO DO UPLOAD FTP -----------------

      console.log('conectando no ftp...');
      const c = new Ftp();
      await new Promise((resolve, reject) => {
        c.connect(ftpConfig, connError => {
          if (connError) {
            next(connError);
          }
        });
        c.on('ready', () => {
          console.log('Conexão estabelecida com sucesso!');

          // Muda o diretório sendo utilizado para temp que é uma pasta padrão do server ftp escolhido
          c.cwd('temp', () => {
            console.log('diretório de trabalho alterado para temp');

            // checa se ja existe um folder para essa manifestação
            c.list((err, list) => {
              console.log('checando diretórios...');

              let folderExist = false;
              list.forEach(folder => {
                folderExist = folder.name === manifestation_id;
              });
              console.log(list);

              // Se o folder não existir é criado
              if (!folderExist) {
                c.mkdir('' + manifestation_id, mkdirError => {
                  if (mkdirError) {
                    console.log(mkdirError);
                    res.status(500).send({
                      message: 'falha ao criar diretório',
                      err: mkdirError,
                    });
                  }
                  // Muda o folder para o que foi criado
                  c.cwd('' + manifestation_id, () => {
                    // realiza o upload
                    c.put(
                      '' + process.cwd() + '/temp/' + file.filename,
                      `${file.filename}`,
                      putError => {
                        if (putError) {
                          res.status(500).send({
                            message: 'falha ao realizar upload',
                            err: putError,
                          });
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
                    putError => {
                      if (putError) {
                        res.status(500).send({
                          message: 'falha ao realizar upload',
                          err: putError,
                        });
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
      c.end();
      console.log('fechou a conexão');
      // FIM DO UPLOAD FTP -----------------------

      // Se chegar até aqui quer dizer que o upload do arquivo foi um sucesso, agora salvaremos a referencia no banco com o model File
      try {
        const extension = extname(req.file.originalname);
        const data = {
          file_name: req.file.originalname,
          file_name_in_server: req.file.filename,
          extension,
        };
        const uploaded_file = await File.create(data);
        await uploaded_file.setUser(user);
        await uploaded_file.setManifestation(manifestation);

        return res
          .status(200)
          .json({ message: 'Arquivo enviado com sucesso', uploaded_file });
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

  // Usa a api como proxy e encaminha a stream do arquivo no servidor FTP para o requisitante
  async show(req, res) {
    const { file_id } = req.params;
    const file = await File.findByPk(file_id);
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload

    // checa se File existe
    if (!file) {
      return res.status(404).json({
        message: 'Arquivo não existe',
      });
    }

    const onwer = user.dataValues.id === file.dataValues.UserId;
    const user_role = req.user_roles[0];

    // checa se Usuário existe
    if (!user) {
      return res.status(404).json({ message: 'usuario não existe' });
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
      console.log('conectando no servidor ftp...');
      const c = new Ftp();
      await new Promise(() => {
        c.connect(ftpConfig);
        c.on('ready', () => {
          console.log('Conexão estabelecida com sucesso!');

          // Muda o diretório sendo utilizado para pasta em que o arquivo se encontra
          c.cwd('temp/' + file.ManifestationId, err => {
            if (err) throw err;
            console.log(
              'diretório de trabalho alterado para temp/' + file.ManifestationId
            );
            c.get(file.file_name_in_server, (getError, stream) => {
              if (getError) throw getError;
              /**
               * Caso tudo der certo termina na linha abaixo, a stream do arquivo é encaminhada
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

  // Remove o arquivo do servidor FTP e remove as associações com a manifestação.
  async delete(req, res) {
    const { file_id } = req.params;
    const file = await File.findByPk(file_id);

    // checa se File existe
    if (!file) {
      return res.status(404).json({
        message: 'Arquivo não existe',
      });
    }

    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const onwer = user.dataValues.id === file.dataValues.UserId;
    const user_role = req.user_roles[0];

    // checa se Usuário existe
    if (!user) {
      return res.status(404).json({ message: 'usuario não existe' });
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
        c.connect(ftpConfig);
        c.on('ready', () => {
          console.log('Conexão estabelecida com sucesso!');

          // Muda o diretório sendo utilizado para pasta em que o arquivo se encontra
          c.cwd('temp/' + file.ManifestationId, err => {
            if (err) throw err;
            console.log(
              'diretório de trabalho alterado para temp/' + file.ManifestationId
            );
            c.delete(file.file_name_in_server, deleteError => {
              if (deleteError) throw deleteError;
              console.log('Arquivo' + file.file_name_in_server + ' apagado');
              deleteFileFromDatabase(file_id);
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

  // Lista todos os arquivos vinculados a manifestação escolhida para consulta
  async fetch(req, res) {
    const { manifestation_id } = req.params;
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const user_role = req.user_roles[0];

    try {
      const manifestation = await Manifestation.findOne({
        where: { id: manifestation_id },
      });

      // checa se a manifestação existe mesmo
      if (!manifestation) {
        return res.status(404).json({ message: 'Manifestação não existe' });
      }

      const onwer = user.dataValues.id === manifestation.dataValues.user_id;

      // checa se é dono do arquivo ou um admin
      if (user_role.title !== 'master' || user_role.title !== 'admin') {
        if (!onwer) {
          return res.status(401).json({
            message:
              'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
          });
        }
      }

      const files = await File.findAll({
        where: {
          ManifestationId: manifestation_id,
        },
        raw: true,
      });
      return res.status(200).json({ files });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno', error });
    }
  }
} // fim da classe

export default new FileController();
