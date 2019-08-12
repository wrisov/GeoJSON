var jwt = require('express-jwt');
var express = require('express');
var route = express.Router();

route.get('/',jwt({secret: 'ey_boss_may_i_have_a_*_please'}), (req, res) => {
    res.sendStatus(200);
});