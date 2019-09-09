var express = require('express');
var router = express.Router();
var chartsController = require('../../controllers/charts/charts');
router.post('/zomatoChart', chartsController.getZomatoCharts);
router.post('/poiChart', chartsController.getPoiCharts);
router.post('/zomatoComparisionChart', chartsController.getZomatoComparisionCharts);
module.exports = router;