import NodeGeocoder from 'node-geocoder';

import geocoderConfig from '../config/geocoder';

class Geocoder {
  constructor() {
    const { apiKey, formatter, provider, httpAdapter } = geocoderConfig;

    this.options = { provider, apiKey, httpAdapter, formatter };

    this.geocoder = NodeGeocoder(this.options);
  }

  // retorna uma promise
  forward(location) {
    return this.geocoder.geocode({ country: 'Brazil', address: location });
  }

  // retorna uma promise
  reverse(latitude, longitude) {
    return this.geocoder.reverse({ lat: latitude, lon: longitude });
  }
}

export default new Geocoder();
