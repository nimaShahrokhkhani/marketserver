var express = require('express');
var router = express.Router();
var db = require('../../helper/db');
var multer = require('multer');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({storage: storage});

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

router.get('/download', function (req, res) {

    var file = __dirname + '/uploads/' + req.query.fileName;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

router.post('/insert', upload.single('file'), function (request, response, next) {
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

router.post('/edit', upload.single('file'), function (request, response, next) {
    let query = {
        username: request.body.username
    };
    let newValuesObject = {
        password: request.body.password,
        company: request.body.company,
        role: request.body.role,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        birthday: request.body.birthday,
        address: request.body.address,
        identityNumber: request.body.identityNumber
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
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
