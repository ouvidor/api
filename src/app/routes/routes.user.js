const express = require('express');
const UserCtrl = require('../controller/user.controller');
const router = express.Router();

router
  .get('/', UserCtrl.getAllUsers)
  .post('/save', UserCtrl.saveToDb)

module.exports = router;