var express = require('express');
var router = express.Router();

var zomatoController = require('../controllers/zomatoController');


router.post('/getcuisines', zomatoController.getCuisines);
router.post('/find',zomatoController.findZomato);
router.post('/geowithin3',zomatoController.geoWithin);
router.post('/geowithin2',zomatoController.geoWithin2);
router.post('/range', zomatoController.range);
router.post('/fields',zomatoController.findMany);
router.post('/findmany',zomatoController.findMultiZom)
module.exports = router;