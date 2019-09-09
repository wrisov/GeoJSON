var express = require('express');
var router = express.Router();
var  POIcontroller = require('../../controllers/shapeFilesController/POI');
 

router.post('/getpoi',POIcontroller.getpoi);
router.post('/getallpoi', POIcontroller.getAllPoi);
router.post('/getpoifilters', POIcontroller.getPoiFilters);
router.post('/getpoiinradius', POIcontroller.getPoiInRadius);
router.post('/getpoicharts', POIcontroller.getCumilativePoiData);
router.post('/getpoibyid', POIcontroller.getPoiById);
router.post('/turf', POIcontroller.getIntersects);
router.post('/storeLocator', POIcontroller.getPoiRandProperty);
module.exports = router;