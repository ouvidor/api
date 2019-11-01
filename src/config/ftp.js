require('dotenv').config();
/**
 * Config para o cliente FTP
 */

module.exports = {
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
};
