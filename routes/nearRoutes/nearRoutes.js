var express = require('express');
var router = express.Router();
var nearController = require('../../controllers/nearController/nearController');
var densityController = require('../../controllers/nearController/populationDesityController');

router.get('/getdetails', nearController.getDetails);
router.post('/getpoiincircle', nearController.getPoiInCircle);
router.post('/getdetailsincircle', nearController.getDetailsInCircle);
router.post('/getpopulationdensity', densityController.getPopulationDensity);


module.exports = router;