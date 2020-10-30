var express = require('express');
var router = express.Router();
var db = require('../../helper/db');
const sessionManager = require('../../helper/sessionManager');

router.post('/', function(request, response, next) {
    let username = request.body.username;
    let password = request.body.password;
    db.find(db.COLLECTIONS.USERS,{username: username, password: password}).then((users) => {
        if (users.length !== 0) {
            response.status(200).json(users[0]);
        } else {
            response.status(409).send("Username not found");
        }
    }).catch(() => {
        response.status(409).send();
    });
});

router.post('/session', function(request, response, next) {
    sessionManager.regenerate(request).then((session) => {
        response.status(200).json('');
    }).catch((error) => {
        next(error);
    });
});

module.exports = router;
