import AppError from '../../errors/AppError';

import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';
import Secretary from '../../models/Secretary';

import generateGeolocation from '../generateGeolocation';
import createManifestationStatus from '../StatusHistory/create';
import checkIfTypeExists from '../Type/checkIfTypeExists';
import checkIfCategoriesExists from '../Category/checkIfCategoriesExists';

import getLatestManifestationStatus from '../../utils/getLatestManifestationStatus';

const updateManifestation = async ({
  id,
  typeId,
  categoriesId = [],
  manifestationData,
  userId,
}) => {
  const doesTypeExistsPromise = checkIfTypeExists(typeId);
  const doesCategoriesExistPromise = checkIfCategoriesExists(categoriesId);

  const doesSecretaryExistsPromise = Secretary.findByPk(
    manifestationData.secretariats_id
  );

  const [
    doesTypeExists,
    doesCategoriesExist,
    doesSecretaryExists,
  ] = await Promise.all([
    doesTypeExistsPromise,
    doesCategoriesExistPromise,
    doesSecretaryExistsPromise,
  ]);

  if (!doesTypeExists && typeId) {
    throw new AppError('Esse tipo de manifestação não existe.');
  }

  if (!doesCategoriesExist && categoriesId.length > 0) {
    throw new AppError('Uma dessas categorias não existe.');
  }

  if (manifestationData.secretariats_id && !doesSecretaryExists) {
    throw new AppError('Essa secretaria não existe');
  }

  let manifestation = await Manifestation.findByPk(id, {
    include: [
      {
        model: ManifestationStatusHistory,
        as: 'status_history',
        attributes: ['id', 'description', 'created_at', 'updated_at'],
        include: [
          {
            model: Status,
            as: 'status',
            attributes: ['id', 'title'],
          },
        ],
      },
    ],
  });

  if (!manifestation) {
    throw new AppError('Essa manifestação não pôde ser encontrada.', 401);
  }

  const latestManifestationStatus = getLatestManifestationStatus(manifestation);

  switch (latestManifestationStatus.status.title) {
    case 'cadastrada':
    case 'complementada':
    case 'arquivada':
      break;

    default:
      throw new AppError(
        'Fora do período disponível para edição da manifestação.'
      );
  }

  const { latitude, longitude, location } = manifestationData;

  delete manifestationData.latitude;
  delete manifestationData.longitude;
  delete manifestationData.location;

  const geolocationData = await generateGeolocation({
    latitude,
    longitude,
    location,
  });

  const formattedData = {
    ...manifestationData,
    types_id: typeId,
    ...geolocationData,
  };

  if (categoriesId.length > 0) {
    await manifestation.setCategories(categoriesId);
  }

  // atualiza a instancia
  manifestation = await manifestation.update(formattedData);

  // se for o dono da manifestação marca como complementada
  if (
    userId === manifestation.users_id &&
    latestManifestationStatus.status.title !== 'complementada'
  ) {
    await createManifestationStatus({
      description: 'Manifestação foi complementada',
      manifestationId: manifestation.id,
      statusIdentifier: 'complementada',
      manifestationAlreadyChecked: true,
    });
  }

  return manifestation;
};

export default updateManifestation;
