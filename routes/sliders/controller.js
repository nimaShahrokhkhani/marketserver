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

router.get('/banner/list', function (request, response, next) {
    let filterData = {
        name: request.query.name,
        image: request.query.image
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.BANNER_SLIDERS, filterData, request.query.offset, request.query.length).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Banner slider not found");
    });
});

router.get('/sale/list', function (request, response, next) {
    let filterData = {
        name: request.query.name,
        image: request.query.image
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.SALE_SLIDERS, filterData, request.query.offset, request.query.length).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Sale slider not found");
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

router.post('/banner/insert', upload.single('file'), function (request, response, next) {
    request.body.image = request.file.filename;
    let dataObject = {
        name: request.body.name,
        image: request.body.image
    };
    db.insert(db.COLLECTIONS.BANNER_SLIDERS, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("Banner slider did not added");
    });
});

router.post('/sale/insert', upload.single('file'), function (request, response, next) {
    request.body.image = request.file.filename;
    let dataObject = {
        name: request.body.name,
        image: request.body.image
    };
    db.insert(db.COLLECTIONS.SALE_SLIDERS, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("Sale slider did not added");
    });
});

router.post('/banner/edit', upload.single('file'), function (request, response, next) {
    let query = {
        name: request.body.name
    };
    request.body.image = request.file ? request.file.filename : undefined;
    let newValuesObject = {
        name: request.body.name,
        image: request.body.image
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.BANNER_SLIDERS, query, newValues).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Banner slider not found");
    });
});

router.post('/sale/edit', upload.single('file'), function (request, response, next) {
    let query = {
        name: request.body.name
    };
    request.body.image = request.file ? request.file.filename : undefined;
    let newValuesObject = {
        name: request.body.name,
        image: request.body.image
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.SALE_SLIDERS, query, newValues).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Sale slider not found");
    });
});

router.post('/banner/delete', function (request, response, next) {
    let query = {
        name: request.body.name
    };
    db.deleteFunction(db.COLLECTIONS.BANNER_SLIDERS, query).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Banner slider not found");
    });
});

router.post('/sale/delete', function (request, response, next) {
    let query = {
        name: request.body.name
    };
    db.deleteFunction(db.COLLECTIONS.SALE_SLIDERS, query).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Sale slider not found");
    });
});

module.exports = router;
