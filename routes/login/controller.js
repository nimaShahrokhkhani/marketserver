var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

router.post('/', function(request, response, next) {
    let username = request.body.username;
    let password = request.body.password;
    db.find(db.COLLECTIONS.USERS,{username: username, password: password}).then((users) => {
        if (users.length !== 0) {
            response.status(200).json();
        } else {
            response.status(409).send("Username not found");
        }
    }).catch(() => {
        response.status(409).send();
    });
});

module.exports = router;
