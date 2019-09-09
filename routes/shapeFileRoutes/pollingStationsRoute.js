var express = require('express');
var router = express.Router();
var pollingStationController = require('../../controllers/shapeFilesController/pollingStation');

router.post('/getpolls', pollingStationController.getPollingStationsHeatMap);
module.exports = router;