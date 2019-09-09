var express = require('express');
var router = express.Router();
var propertyRatesController = require('../../controllers/shapeFilesController/propertyRatesController');

router.post('/getRates', propertyRatesController.getRatesHeatMap);

module.exports = router;