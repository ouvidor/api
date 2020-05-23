import AppError from '../../errors/AppError';
import File from '../../models/File';
import Manifestation from '../../models/Manifestation';

const fetchFiles = async ({ manifestationId, userId, userRoleId }) => {
  const manifestation = await Manifestation.findOne({
    where: { id: manifestationId },
  });

  if (!manifestation) {
    throw new AppError('Manifestação não existe.', 404);
  }

  const isOwner = userId === manifestation.users_id;
  const isCitizen = userRoleId < 2;

  if (!isOwner && isCitizen) {
    throw new AppError(
      'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo.',
      403
    );
  }

  const files = await File.findAll({
    where: {
      manifestations_id: manifestationId,
    },
  });

  return files;
};

export default fetchFiles;
