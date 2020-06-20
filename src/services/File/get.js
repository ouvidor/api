import database from '../../database';
import GoogleCloudStorage from '../../lib/GoogleCloudStorage';
import AppError from '../../errors/AppError';
import File from '../../models/File';

const getFile = async ({ fileId, userId, userRoleId }) => {
  const file = await File.findByPk(fileId);

  if (!file) {
    throw new AppError('Arquivo não existe.', 404);
  }

  const isFileLinkedToManifestation = !!file.manifestations_id;
  let innerJoinQuery = '';

  if (isFileLinkedToManifestation) {
    innerJoinQuery = `
      INNER JOIN manifestations m ON
        m.id = f.manifestations_id
    `;
  } else {
    innerJoinQuery = `
      INNER JOIN manifestations_status_history msh ON
        msh.id = f.manifestations_status_id
      INNER JOIN manifestations m ON
        m.id = msh.manifestations_id
    `;
  }

  const isManifestationOwnerQueryPromise = database.query(`
    SELECT
      f.id
    FROM
      files f
    ${innerJoinQuery}
    WHERE
      m.users_id = ${userId}
      AND f.id = ${fileId}
  `);

  const [[isManifestationOwner]] = await Promise.all([
    isManifestationOwnerQueryPromise,
  ]);

  const isCitizen = userRoleId < 2;

  if (!isManifestationOwner && isCitizen) {
    throw new AppError(
      'Não autorizado, apenas administradores e donos da manifestação podem acessa-lo.',
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
