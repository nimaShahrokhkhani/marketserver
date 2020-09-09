var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

router.post('/', function(request, response, next) {
    let username = request.body.username;
    let password = request.body.password;
    db.find(db.COLLECTIONS.USERS,{username: username, password: password}).then((users) => {
        response.status(200).json(users[0]);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

module.exports = router;
