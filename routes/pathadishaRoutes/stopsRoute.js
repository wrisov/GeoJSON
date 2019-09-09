var express = require('express');
var router = express.Router();
var stopController = require('../../controllers/pathadishaController/stopsController');
router.post('/getstops', stopController.getStops);
router.post('/getroutesfromstop', stopController.getRoutesFromStop);
router.post('/getrouteobjects', stopController.getRouteObjects);
router.post('/getroutesfromdatabase', stopController.getRoutesFromDatabase);
router.post('/getheatmaps', stopController.getHeatMap);

module.exports = router;