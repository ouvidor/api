import { Op } from 'sequelize';

import AppError from '../../errors/AppError';

import User from '../../models/User';
import Manifestation from '../../models/Manifestation';
import Type from '../../models/Type';
import Category from '../../models/Category';
import Prefecture from '../../models/Prefecture';
import Ombudsman from '../../models/Ombudsman';

import createManifestationStatus from '../StatusHistory/create';
import generateGeolocation from '../../utils/generateGeolocation';

async function create({
  categoriesId,
  typeId,
  title,
  description,
  latitude,
  longitude,
  location,
  city,
  userId,
}) {
  // caso o token informado seja de um usuário que não existe
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('Esse usuário não existe.', 401);
  }

  const prefecture = await Prefecture.findOne({
    where: { name: city },
    include: [{ model: Ombudsman, as: 'ombudsman' }],
  });

  if (!prefecture) {
    throw new AppError('Nome da cidade inválido. Refaça o login.');
  }

  let manifestation;

  const geolocationData = await generateGeolocation({
    latitude,
    location,
    longitude,
    city,
  });
  const formattedData = {
    title,
    description,
    ...geolocationData,
  };
  try {
    const typeExists = await Type.findOne({ where: { id: typeId } });

    if (!typeExists) {
      throw new AppError('Esse tipo de manifestação não existe.');
    }

    manifestation = await Manifestation.create({
      ...formattedData,
      types_id: typeId,
      users_id: userId,
      ombudsmen_id: prefecture.ombudsman.id,
    });

    if (categoriesId) {
      const categoriesExists = await Category.findAll({
        where: {
          id: {
            [Op.in]: categoriesId,
          },
        },
      });

      if (categoriesExists.length !== categoriesId.length) {
        throw new AppError('Uma dessas categorias não existe.');
      }

      await manifestation.setCategories(categoriesId);
    }

    await createManifestationStatus({
      description: 'A manifestação foi cadastrada',
      manifestationId: manifestation.id,
      statusIdentifier: 'cadastrada',
      manifestationAlreadyChecked: true,
    });

    return manifestation;
  } catch (error) {
    if (manifestation) {
      manifestation.destroy();
    }

    throw error;
  }
}

export default create;
