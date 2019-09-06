/*
  As routes importam os seus controllers respectivos, e chamam suas callbacks de la,
  exemploe: .get('/', UserCtrl.getAllUsers <<<< é a callback) as callbacks das
  rotas são o que definem como vai ser tratada a requisição
*/



const express = require('express');
const AuthCtrl = require('../controller/auth.controller');
// const UserMidl = require('../middlewares/middlewares.user');
const router = express.Router();

router
  .post('/login', AuthCtrl.login)


module.exports = router;