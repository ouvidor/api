/**
 * Factory para classes do sistema
 * capaz de gerar objetos diferentes para testes
 */
import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';

factory.define('User', User, {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(6),
});

export default factory;
