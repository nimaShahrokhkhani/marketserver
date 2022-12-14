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

router.get('/list', function(request, response, next) {
    let filterData = {
        name: request.query.name,
        image: request.query.image,
        isCandidate: request.query.isCandidate
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.MASTER_CATEGORIES, filterData).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Master category not found");
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

router.post('/insert', upload.single('file'), function(request, response, next) {
    request.body.image = request.file ? request.file.filename : undefined;

    let dataObject = {
        name: request.body.name,
        image: request.body.image,
        isCandidate: request.body.isCandidate
    };


    db.insert(db.COLLECTIONS.MASTER_CATEGORIES, dataObject).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Master category did not added");
    });
});

router.post('/edit', upload.single('file'), function(request, response, next) {
    let query = {
        type: request.body.type
    };
    request.body.image = request.file ? request.file.filename : undefined;
    let newValuesObject = {
        name: request.body.name,
        image: request.body.image,
        isCandidate: request.body.isCandidate
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.MASTER_CATEGORIES, query, newValues).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Master category not found");
    });
});

router.post('/delete', function(request, response, next) {
    let query = {
        name: request.body.name
    };
    db.deleteFunction(db.COLLECTIONS.MASTER_CATEGORIES, query).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Master category not found");
    });
});

module.exports = router;
