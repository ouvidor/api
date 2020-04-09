// A regra do eslint abaixo é importante
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

import { Storage } from '@google-cloud/storage';
import fileSystem from 'fs';
import { extname } from 'path';
import File from '../models/File';
import Manifestation from '../models/Manifestation';
import User from '../models/User';

/**
 * Constantes da classe
 */

const bucketName = 'ouvidor';

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

class FileController {
  /**
   *  Funções usadas em rotas
   */

  // Realiza o upload de um arquivo para o servidor FTP
  async save(req, res) {
    console.log('upload');
    const { manifestation_id } = req.body;
    const { file } = req; // Pega o arquivo que o multer(middleware) tratou e colocou na req
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const manifestation = await Manifestation.findByPk(manifestation_id); // manifestação que irá receber o arquivo

    const storage = new Storage();

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
    const isOwner = user.dataValues.id === manifestation.dataValues.user_id;
    const user_role = req.user_roles[0];

    if (
      isOwner ||
      user_role.title === 'master' ||
      user_role.title === 'admin'
    ) {
      // INICIO DO UPLOAD -----------------
      await storage
        .bucket(bucketName)
        .upload(`${process.cwd()}/temp/${req.file.filename}`, {
          gzip: true,

          metadata: {
            cacheControl: 'no-cache',
          },
        })
        .catch(err => {
          console.log(err);
          return res.status(401).json({
            message: { msg: 'erro', err },
          });
        });

      // Se chegar até aqui quer dizer que o upload do arquivo foi um sucesso, agora salvaremos a referencia no banco com o model File
      try {
        const extension = extname(file.originalname);
        const data = {
          file_name: file.originalname,
          file_name_in_server: file.filename,
          extension,
        };
        const uploaded_file = await File.create(data);
        await uploaded_file.setUser(user);
        await uploaded_file.setManifestation(manifestation);

        deleteTempFile(file);

        return res
          .status(200)
          .json({ message: 'Arquivo enviado com sucesso', uploaded_file });
      } catch (error) {
        console.log(error);
        deleteTempFile(file);

        return res.status(500).json({ message: 'Erro', error });
      }
    }
    return res.status(500).json({ message: 'Erro' });
  }

  // Usa a api como proxy e encaminha a stream do arquivo no servidor de arquivos para o requisitante
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

    const isOwner = user.dataValues.id === file.dataValues.UserId;
    const user_role = req.user_roles[0];

    // checa se Usuário existe
    if (!user) {
      return res.status(404).json({ message: 'usuario não existe' });
    }
    // checa se é dono do arquivo ou um admin
    if (user_role.title !== 'master' || user_role.title !== 'admin') {
      if (!isOwner) {
        return res.status(401).json({
          message:
            'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
        });
      }
    }

    // Caso passe nas checagens, segue fluxo normal
    try {
      console.log('conectando no servidor de arquivos...');
      const storage = new Storage();

      // Downloads the file
      const remote_file = storage
        .bucket(bucketName)
        .file(file.file_name_in_server);

      // O reader abaixo faz com que o arquivo seja encaminhado para download
      res.header(
        'Content-Disposition',
        `attachment; filename=${file.file_name}`
      );

      // O header abaixo o encaminha como INLINE, ou seja, o aparelho pega os dados para exibir, ex: um pdf mandado como inline é exibido no navegador
      // res.header(
      //   'Content-Disposition',
      //   'attachment; filename=' + file.file_name
      // );

      return remote_file
        .createReadStream()
        .on('error', err => {
          console.log(err);
        })
        .pipe(res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Algo deu errado' }, error);
    }
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
      console.log('conectando no servidor de arquivos...');
      const storage = new Storage();

      // Deletes the file from the bucket
      await storage
        .bucket(bucketName)
        .file(file.file_name_in_server)
        .delete();

      // Deleta arquivo do DB
      file.destroy();

      return res.status(200).json({
        message: 'Arquivo excluido com sucesso',
        file,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Algo deu errado' }, error);
    }
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
