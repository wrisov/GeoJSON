var express = require('express');
var router = express.Router();
var  POIcontroller = require('../controllers/POI');
 

router.post('/geoWithin',POIcontroller.geoWithin2);

module.exports = router;