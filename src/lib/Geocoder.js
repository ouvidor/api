/**
 * Classe responsável por fazer a geolocalização do endereço
 */
import NodeGeocoder from 'node-geocoder';

import geocoderConfig from '../config/geocoder';

class Geocoder {
  constructor() {
    const { apiKey, formatter, provider, httpAdapter } = geocoderConfig;

    this.options = { provider, apiKey, httpAdapter, formatter };

    this.geocoder = NodeGeocoder({
      ...this.options,
      language: 'pt-BR',
      region: 'BR',
    });
  }

  // retorna uma promise
  forward(location, city) {
    return this.geocoder.geocode({
      country: 'Brasil',
      address: `${location}, ${city}`,
    });
  }

  // retorna uma promise
  reverse(latitude, longitude) {
    return this.geocoder.reverse({ lat: latitude, lon: longitude });
  }
}

export default new Geocoder();
