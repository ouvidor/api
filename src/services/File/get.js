import GoogleCloudStorage from '../../lib/GoogleCloudStorage';
import AppError from '../../errors/AppError';
import File from '../../models/File';

const getFile = async ({ fileId, userId, userRoleId }) => {
  const file = await File.findByPk(fileId);

  if (!file) {
    throw new AppError('Arquivo não existe.', 404);
  }

  const isOwner = userId === file.users_id;
  const isCitizen = userRoleId < 2;

  if (!isOwner && isCitizen) {
    throw new AppError(
      'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo.',
      403
    );
  }

  try {
    const remoteFile = GoogleCloudStorage.getRemoteFile(file.name_in_server);

    return { remoteFile, localFile: file };
  } catch (error) {
    throw new AppError('Erro ao pegar o arquivo.', 503);
  }
};

export default getFile;
