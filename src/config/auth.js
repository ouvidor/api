/**
 * Config para o token JWT
 */
module.exports = {
  secret: process.env.AUTH_SECRET,
  expiresIn: '30d',
};
