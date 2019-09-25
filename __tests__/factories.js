/**
 * Factory para classes do sistema
 * capaz de gerar objetos diferentes para testes
 */
import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';

factory.define('User', User, {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password_temp: faker.internet.password(6),
});

export default factory;
