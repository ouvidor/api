import geocoder from '../lib/Geocoder';
import AppError from '../errors/AppError';

const generateGeolocation = async ({ location, latitude, longitude }) => {
  // reverse
  if (latitude && longitude) {
    const [bestResult] = await geocoder
      .reverse(latitude, longitude)
      .catch(() => {
        throw new AppError('Latitude/Longitude invalida.');
      });
    return {
      location: `${bestResult.streetName}, ${bestResult.extra.neighborhood}`,
    };
  }

  // forward
  if (location) {
    const [bestResult] = await geocoder.forward(location).catch(() => {
      throw new AppError('Localização invalida.');
    });

    return { latitude: bestResult.latitude, longitude: bestResult.longitude };
  }

  return {};
};

export default generateGeolocation;
