const express = require('express');
const router = express.Router();

const shape_controller = require('../../controllers/shapeFilesController/shapeController');

//var villageController = require('../../controllers/village');
//const town_controller = require('../controllers/town')
const POI_controller = require('../../controllers/shapeFilesController/POI');
router.post('/search',shape_controller.search);
router.post('/loadname',shape_controller.loadname);
router.post('/loadLevel',shape_controller.loadlevel);
router.post('/getcoordinates', shape_controller.loadnew);

//router.get('/showvillages', villageController.findVil);
//router.get('/showtowns',town_controller.findTown);
router.get('/showPOI',POI_controller.findPOI);
router.post('/geowithin', shape_controller.geoWithin);
router.post('/getlevelnames', shape_controller.getlevelnames);
//router.post('/geoWithin',shape_controller.geoWithin);
//router.post('/geoWithin2',shape_controller.geoWithin2);

module.exports = router;