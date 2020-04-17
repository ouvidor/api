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
import { extname, resolve } from 'path';
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
function deleteTempFiles(files) {
  files.forEach(file => {
    if (file) {
      fileSystem.unlink(`${process.cwd()}/temp/${file.filename}`, error => {
        if (error) throw error;
        console.log(`Arquivo ${file.filename} deletado!`);
      });
    }
  });
}

class FileController {
  /**
   *  Funções usadas em rotas
   */

  async save(req, res) {
    const { manifestation_id } = req.body;
    const { files } = req; // Pega o arquivo que o multer(middleware) tratou e colocou na req
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const manifestation = await Manifestation.findByPk(manifestation_id); // manifestação que irá receber o arquivo

    /**
     * Precisa ser enviado um arquivo no mínimo
     * O usuário deve existir
     * A manifestação deve existir
     */
    if (!files) {
      return res
        .status(400)
        .json({ message: 'Não consta um arquivo na requisição' });
    }

    if (!manifestation || !user) {
      deleteTempFiles(files);
      if (!manifestation) {
        return res.status(404).json({ message: 'Manifestação não existe' });
      }
      return res.status(500).json({ message: 'Usuario não existe' });
    }

    const isOwner = user.id === manifestation.user_id;
    const isUserAnAdmin = req.user_role > 1;

    /**
     * O usuário deve ser dono da manifestação
     * OU
     * O usuário deve ser um administrador
     */
    if (!isOwner || !isUserAnAdmin) {
      return res.status(401).json({
        message:
          'Não tem permissão para enviar um arquivo para essa manifestação',
      });
    }

    // Inicio do upload dos arquivos
    const storage = new Storage();
    const ouvidorBucket = await storage.bucket(bucketName);

    const uploadPromises = files.map(file =>
      ouvidorBucket.upload(`${process.cwd()}/temp/${file.filename}`, {
        gzip: true,
        resumable: false,
        metadata: {
          cacheControl: 'no-cache',
        },
      })
    );

    await Promise.all(uploadPromises).catch(error => {
      console.error(error);
      return res.status(401).json({
        message: { message: 'Erro no envio de arquivos', error },
      });
    });

    /**
     * Já que o upload dos arquivos foi um sucesso ele salva os dados no banco
     */
    try {
      const formattedFiles = files.map(file => ({
        extension: extname(file.originalname),
        file_name: file.originalname,
        file_name_in_server: file.filename,
      }));

      const savedFiles = await File.bulkCreate(formattedFiles);
      savedFiles.forEach(async file => {
        await file.setUser(user);
        await file.setManifestation(manifestation);
      });

      deleteTempFiles(files);

      return res.status(200).json(savedFiles);
    } catch (error) {
      console.error(error);
      deleteTempFiles(files);

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }

  // Usa a api como proxy e encaminha a stream do arquivo no servidor de arquivos para o requisitante
  async show(req, res) {
    const { file_id } = req.params;
    const { user_role } = req;
    const file = await File.findByPk(file_id);
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload

    // checa se File existe
    if (!file) {
      return res.status(404).json({
        message: 'Arquivo não existe',
      });
    }

    // checa se Usuário existe
    if (!user) {
      return res.status(404).json({ message: 'usuario não existe' });
    }

    const isOwner = user.dataValues.id === file.dataValues.user_id;
    const isCitizen = user_role.id < 2;

    if (!isOwner && isCitizen) {
      return res.status(401).json({
        message:
          'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
      });
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
    const { user_role } = req;
    const file = await File.findByPk(file_id);

    // checa se File existe
    if (!file) {
      return res.status(404).json({
        message: 'Arquivo não existe',
      });
    }

    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload

    // checa se Usuário existe
    if (!user) {
      return res.status(404).json({ message: 'usuario não existe' });
    }

    const isOwner = user.dataValues.id === file.dataValues.user_id;
    const isCitizen = user_role.id < 2;

    if (!isOwner && isCitizen) {
      return res.status(401).json({
        message:
          'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
      });
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

      return res.status(200).json(file);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }

  // Lista todos os arquivos vinculados a manifestação escolhida para consulta
  async fetch(req, res) {
    const { manifestation_id } = req.params;
    const user = await User.findByPk(req.user_id); // usuario que fez a requisição de upload
    const { user_role } = req;

    try {
      const manifestation = await Manifestation.findOne({
        where: { id: manifestation_id },
      });

      // checa se a manifestação existe mesmo
      if (!manifestation) {
        return res.status(404).json({ message: 'Manifestação não existe' });
      }

      const isOwner = user.dataValues.id === manifestation.dataValues.user_id;
      const isCitizen = user_role.id < 2;

      if (!isOwner && isCitizen) {
        return res.status(401).json({
          message:
            'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
        });
      }

      const files = await File.findAll({
        where: {
          manifestation_id,
        },
      });
      return res.status(200).json({ files });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno', error });
    }
  }
} // fim da classe

export default new FileController();
