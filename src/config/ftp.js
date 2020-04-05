/**
 * Config para o cliente FTP
 */

require('dotenv').config();

export default {
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
};
