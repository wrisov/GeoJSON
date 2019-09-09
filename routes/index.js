var express = require('express');
var router = express.Router();
var con = require('../services/sqlDB');
/* GET home page. */
router.get('/', function(req, res, next) {
  con.connect((err) => {
    console.log('error is', err);
    console.log('connected');
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
