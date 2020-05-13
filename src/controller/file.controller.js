/**
 * Arquivo responsavel por salvar temporariamente a imagem no folder 'temp', e envia-la para a Google Cloud Storage.
 */

/**
 * TODO:
 *  - Limitar a quantidade de arquivos que uma manifestação pode ter.
 */

import fileSystem from 'fs';
import { extname } from 'path';

import File from '../models/File';
import Manifestation from '../models/Manifestation';
import User from '../models/User';
import setResponseHeaders from '../utils/setResponseHeaders';
import GoogleCloudStorage from '../lib/GoogleCloudStorage';

// Função responsável por limpar o cache
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

    const isOwner = user.id === manifestation.users_id;
    const isUserAnAdmin = req.user_role.id > 1;

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

    const uploadPromises = files.map(file =>
      GoogleCloudStorage.upload(file.filename)
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
        name: file.originalname,
        name_in_server: file.filename,
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
      files.forEach(file => GoogleCloudStorage.delete(file.filename));

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }

  // Usa a api como proxy e encaminha a stream do arquivo no servidor de arquivos para o requisitante
  async show(req, res) {
    const { file_id } = req.params;
    const { user_role } = req;
    const file = await File.findByPk(file_id);
    const user = await User.findByPk(req.user_id);

    if (!file) {
      return res.status(404).json({
        message: 'Arquivo não existe',
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuário não existe' });
    }

    const isOwner = user.id === file.users_id;
    const isCitizen = user_role.id < 2;

    if (!isOwner && isCitizen) {
      return res.status(401).json({
        message:
          'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
      });
    }

    try {
      const remote_file = GoogleCloudStorage.getRemoteFile(file.name_in_server);

      res = setResponseHeaders(res, file);

      return remote_file
        .createReadStream()
        .on('error', async error => {
          // se o arquivo não for achado
          if (error.code === 404) {
            file.destroy();
            return res
              .status(404)
              .json({ message: 'Esse arquivo não pôde ser achado' });
          }
          return res.status(500).json({ message: 'Erro ao buscar o arquivo' });
        })
        .pipe(res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Algo deu errado' }, error);
    }
  }

  async delete(req, res) {
    const { file_id } = req.params;
    const { user_role } = req;
    const file = await File.findByPk(file_id);

    if (!file) {
      return res.status(404).json({
        message: 'Arquivo não existe',
      });
    }

    const user = await User.findByPk(req.user_id);

    if (!user) {
      return res.status(404).json({ message: 'usuario não existe' });
    }

    const isOwner = user.id === file.users_id;
    const isCitizen = user_role.id < 2;

    if (!isOwner && isCitizen) {
      return res.status(401).json({
        message:
          'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
      });
    }

    try {
      GoogleCloudStorage.delete(file.name_in_server);

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
    const user = await User.findByPk(req.user_id);
    const { user_role } = req;

    try {
      const manifestation = await Manifestation.findOne({
        where: { id: manifestation_id },
      });

      if (!manifestation) {
        return res.status(404).json({ message: 'Manifestação não existe' });
      }

      const isOwner = user.id === manifestation.users_id;
      const isCitizen = user_role.id < 2;

      if (!isOwner && isCitizen) {
        return res.status(401).json({
          message:
            'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo',
        });
      }

      const files = await File.findAll({
        where: {
          manifestations_id: manifestation_id,
        },
      });
      return res.status(200).json({ files });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno', error });
    }
  }
} // fim da classe

export default new FileController();
