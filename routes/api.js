var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('router working');
});
router.get('/hello', (req, res) => {
    res.send('{hi: hello, name: soumik}');
});

module.exports = router;