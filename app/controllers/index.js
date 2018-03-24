const express = require('express');
const router = express.Router();
const CONSTANTS = require('../utils/constants');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { version: CONSTANTS.version });
});

//LOGIN HOMEPAGE
router.get('/login', function(req, res, next){
    res.render('login');
});

//USERS
router.get('/users', function(req, res, next){
    res.render('userGrid', {version: CONSTANTS.version});
});

module.exports = router;
