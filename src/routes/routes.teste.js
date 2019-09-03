const express = require('express');
const UserCtrl = require('../controller/user.controller');
const teste = express.Router();

teste
  .get('/', UserCtrl.teste)

module.exports = teste;