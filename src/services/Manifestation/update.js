import Manifestation from '../../models/Manifestation';

import AppError from '../../errors/AppError';
import generateGeolocation from '../generateGeolocation';
import doesTypeExists from '../Type/doesTypeExists';
import doesCategoriesExists from '../Category/doesCategoriesExists';

const updateManifestation = async ({
  id,
  typeId,
  categoriesId = [],
  manifestationData,
}) => {
  if (typeId) {
    if (!doesTypeExists(typeId)) {
      throw new AppError('Esse tipo de manifestação não existe.');
    }
  }

  if (categoriesId) {
    if (!doesCategoriesExists(categoriesId)) {
      throw new AppError('Uma dessas categorias não existe.');
    }
  }

  let manifestation = await Manifestation.findByPk(id);

  if (!manifestation) {
    throw new AppError('Essa manifestação não pôde ser encontrada.', 401);
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

  return manifestation;
};

export default updateManifestation;
