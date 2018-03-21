var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//LOGIN HOMEPAGE
router.get('/login', function(req, res, next){
    res.render('login');
});

router.get('/user', function(req, res, next){
    res.render('login');
});

module.exports = router;
