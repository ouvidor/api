import geocoder from '../lib/Geocoder';
import AppError from '../errors/AppError';

const generateGeolocation = async ({ location, latitude, longitude, city }) => {
  // reverse
  if (latitude && longitude) {
    const [bestResult] = await geocoder
      .reverse(latitude, longitude)
      .catch(() => {
        throw new AppError('Latitude/Longitude invalida.');
      });
    return {
      location: bestResult.formattedAddress,
      latitude,
      longitude,
    };
  }

  // forward
  if (location && city) {
    const [bestResult] = await geocoder.forward(location, city).catch(() => {
      throw new AppError('Localização invalida.');
    });

    return {
      location: bestResult.formattedAddress,
      latitude: bestResult.latitude,
      longitude: bestResult.longitude,
    };
  }

  return {};
};

export default generateGeolocation;
