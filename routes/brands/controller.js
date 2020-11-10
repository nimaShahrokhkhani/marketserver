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
        name: request.query.name,
        image: request.query.image,
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.BRANDS, filterData).then((brands) => {
        response.status(200).json(brands);
    }).catch(() => {
        response.status(409).send("Brand not found");
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
    request.body.image = request.file.filename;
    let dataObject = {
        name: request.body.name,
        image: request.body.image,
    };
    db.insert(db.COLLECTIONS.BRANDS, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("Brand did not added");
    });
});

router.post('/edit', upload.single('file'), function (request, response, next) {
    let query = {
        name: request.body.name
    };
    request.body.image = request.file ? request.file.filename : undefined;
    let newValuesObject = {
        name: request.body.name,
        image: request.body.image,
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.BRANDS, query, newValues).then((brands) => {
        response.status(200).json(brands);
    }).catch(() => {
        response.status(409).send("Brand not found");
    });
});

router.post('/delete', function (request, response, next) {
    let query = {
        name: request.body.name
    };
    db.deleteFunction(db.COLLECTIONS.BRANDS, query).then((brands) => {
        response.status(200).json(brands);
    }).catch(() => {
        response.status(409).send("Brand not found");
    });
});

module.exports = router;
