var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var pathadishaStops = require('./pathadishaRoutes/stopsRoute');
var pathadishaHopon = require('./pathadishaRoutes/hoponRoutes');
var shaperoutes = require('./shapeFileRoutes/shaperoutes');
var zomatoRouter = require('./shapeFileRoutes/zomatoRoutes');
var POIrouter = require('./shapeFileRoutes/POIroutes');
var chartsRouter = require('./charts/chartsRoute');
var pollingStationsRouter = require('./shapeFileRoutes/pollingStationsRoute');
var nearRouter = require('./nearRoutes/nearRoutes');
var propertyRatesRouter = require('./shapeFileRoutes/propertyRatesRoute');
var satelliteRouter = require('../routes/shapeFileRoutes/satelliteRoutes');
var censusRouter = require('./shapeFileRoutes/censusRoutes');
var demographyRouter =  require('./shapeFileRoutes/demogrphyRoutes');
var affluenceRouter = require('./shapeFileRoutes/affluenceRoutes');


router.use('/shapes',  shaperoutes);
router.use('/zomato',  zomatoRouter);
router.use('/poi',  POIrouter);
router.use('/stops',  pathadishaStops);
router.use('/hopon',  pathadishaHopon);
router.use('/charts',  chartsRouter);
router.use('/satellite', satelliteRouter);
router.use('/near', nearRouter);
router.use('/polling',  pollingStationsRouter);
router.use('/propertyrate',   propertyRatesRouter);
router.use('/census',  censusRouter);
router.use('/demography', demographyRouter);
router.use('/affluence', affluenceRouter);

module.exports = router;