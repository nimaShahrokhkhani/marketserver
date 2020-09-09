var express = require('express');
var router = express.Router();

router.post('/', function(request, response, next) {

    response.status(200).json({username: 'nima'});
});

module.exports = router;
