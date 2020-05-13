import geocoder from '../lib/Geocoder';

class GeolocationService {
  async run({ location, latitude, longitude }) {
    // reverse
    if (latitude && longitude) {
      const [bestResult] = await geocoder.reverse(latitude, longitude);
      return {
        location: `${bestResult.streetName}, ${bestResult.extra.neighborhood}`,
      };
    }

    // forward
    if (location) {
      const [bestResult] = await geocoder.forward(location);

      return { latitude: bestResult.latitude, longitude: bestResult.longitude };
    }

    return {};
  }
}

export default new GeolocationService();
