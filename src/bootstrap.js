const dotenv = require('dotenv');

let path;

switch (process.env.NODE_ENV) {
  case 'test':
    path = '.env.test';
    break;
  default:
    path = '.env';
}

dotenv.config({ path });
