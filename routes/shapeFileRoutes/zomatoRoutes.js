var express = require('express');
var router = express.Router();

var zomatoController = require('../../controllers/shapeFilesController/zomatoController');


router.post('/getcuisines', zomatoController.getCuisines);
router.post('/find', zomatoController.findZomato);
router.post('/geowithin3', zomatoController.geoWithin);
router.post('/getZomatoCoordinates', zomatoController.getZomatoCoordinates);
router.post('/getDetails', zomatoController.getDetails);
router.post('/range', zomatoController.range);
router.post('/fields', zomatoController.findMany);
router.post('/findmany', zomatoController.findMultiZom);
// chart route
router.post('/getchart', zomatoController.getChart);
module.exports = router;