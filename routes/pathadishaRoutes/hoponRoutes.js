var express = require('express');
var router = express.Router();
var hoponController = require('../../controllers/pathadishaController/hoponController');

router.post('/gethoponheatmap', hoponController.getHoponHeatMap);

module.exports = router;