var express = require('express');
var router = express.Router();
var affluenceController = require('../../controllers/shapeFilesController/affluenceController');

router.post('/getdata', affluenceController.getData);

module.exports = router;