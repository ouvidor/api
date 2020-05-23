import GoogleCloudStorage from '../../lib/GoogleCloudStorage';
import AppError from '../../errors/AppError';
import File from '../../models/File';

const deleteFile = async ({ fileId, userId, userRoleId }) => {
  const file = await File.findByPk(fileId);

  if (!file) {
    throw new AppError('Arquivo não existe.', 404);
  }

  const isOwner = userId === file.users_id;
  const isCitizen = userRoleId < 2;

  if (!isOwner && isCitizen) {
    throw new AppError(
      'Não autorizado, apenas administradores e donos do arquivo podem deleta-lo.',
      403
    );
  }

  GoogleCloudStorage.delete(file.name_in_server).catch(() => {
    throw new AppError('Erro ao pegar o arquivo, tente novamente.', 500);
  });

  // deleta arquivo no banco de dados
  await file.destroy();

  return file;
};

export default deleteFile;
