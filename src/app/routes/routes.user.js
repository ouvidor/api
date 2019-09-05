/*
  As routes importam os seus controllers respectivos, e chamam suas callbacks de la,
  exemploe: .get('/', UserCtrl.getAllUsers <<<< é a callback) as callbacks das
  rotas são o que definem como vai ser tratada a requisição
*/



const express = require('express');
const UserCtrl = require('../controller/user.controller');
const UserMidl = require('../middlewares/middlewares.user');
const router = express.Router();

router
  .get('/', UserCtrl.getAllUsers)//ROTA DE TESTE, EXCLUIR
  .post('/login', UserMidl.validateHashPassword, UserCtrl.login)
  .post('/save', UserMidl.bcryptUserData, UserCtrl.saveToDb)

module.exports = router;