var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

router.post('/', function(request, response, next) {
    db.find(db.COLLECTIONS.USERS).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

module.exports = router;
