const dotenv = require('dotenv');

let path;

console.log(process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case 'test':
    path = '.env.test';
    break;
  case 'local':
    path = '.env.local';
    break;
  default:
    path = '.env';
}

dotenv.config({ path });
