var express = require('express');
var router = express.Router();
var censusController = require('../../controllers/shapeFilesController/censusController');

router.post('/getcensuscharts', censusController.getCumilativeData);
router.post('/getcensusdata', censusController.getCumilativeData);
router.post('/getnormalcensusdata', censusController.getNormalizedData);

module.exports = router;
