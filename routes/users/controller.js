var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

router.get('/list', function (request, response, next) {
    let filterData = {
        username: request.body.username,
        password: request.body.password,
        company: request.body.company,
        role: request.body.role,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        birthday: request.body.birthday,
        address: request.body.address,
        identityNumber: request.body.identityNumber,
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.USERS, filterData).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

router.post('/insert', function (request, response, next) {
    let dataObject = {
        username: request.body.username,
        password: request.body.password,
        company: request.body.company,
        role: request.body.role,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        birthday: request.body.birthday,
        address: request.body.address,
        identityNumber: request.body.identityNumber,
    };
    db.insert(db.COLLECTIONS.USERS, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("User did not added");
    });
});

router.post('/edit', function (request, response, next) {
    let query = {
        username: request.body.username
    };
    let newValues = {
        password: request.body.newValue.password,
        company: request.body.newValue.company,
        role: request.body.newValue.role,
        email: request.body.newValue.email,
        phoneNumber: request.body.newValue.phoneNumber,
        birthday: request.body.newValue.birthday,
        address: request.body.newValue.address,
        identityNumber: request.body.newValue.identityNumber
    };
    db.update(db.COLLECTIONS.USERS, query, newValues).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

router.post('/delete', function (request, response, next) {
    let query = {
        username: request.body.username
    };
    db.deleteFunction(db.COLLECTIONS.USERS, query).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

module.exports = router;
