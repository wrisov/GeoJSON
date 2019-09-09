var express = require('express');
var router = express.Router();
var demographyController = require('../../controllers/shapeFilesController/demographyController');

router.post('/getdata', demographyController.getData);

module.exports = router;