var express = require('express');
var router = express.Router();
var satelliteController = require('../../controllers/shapeFilesController/satelliteController');
router.post('/getData', satelliteController.getData);

module.exports = router;