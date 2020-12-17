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

router.get('/type/list', function(request, response, next) {
    let filterData = {
        name: request.query.name
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.EVENT_TYPES, filterData).then((eventTypes) => {
        response.status(200).json(eventTypes);
    }).catch(() => {
        response.status(409).send("Event types not found");
    });
});

router.get('/list', function(request, response, next) {
    let filterData = {
        id: request.query.id,
        description: request.query.description,
        company: request.query.company,
        dateModify: request.query.dateModify,
        image: request.query.image,
        isCandidate: request.query.isCandidate,
        type: request.query.type
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.EVENTS, filterData).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Events not found");
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

router.post('/type/insert', function(request, response, next) {

    let dataObject = {
        name: request.body.name
    };


    db.insert(db.COLLECTIONS.EVENT_TYPES, dataObject).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Event types did not added");
    });
});

router.post('/insert', upload.single('file'), function(request, response, next) {
    request.body.image = request.file.filename;

    let dataObject = {
        id: request.body.id,
        events: request.body.events,
        dateModify: request.body.dateModify,
        company: request.body.company,
        description: request.body.description,
        image: request.body.image,
        isCandidate: request.body.isCandidate,
        type: request.body.type
    };


    db.insert(db.COLLECTIONS.EVENTS, dataObject).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Events did not added");
    });
});

router.post('/edit', upload.single('file'), function(request, response, next) {
    let query = {
        id: request.body.id
    };
    request.body.image = request.file ? request.file.filename : undefined;
    let newValuesObject = {
        id: request.body.id,
        events: request.body.events,
        dateModify: request.body.dateModify,
        company: request.body.company,
        description: request.body.description,
        image: request.body.image,
        isCandidate: request.body.isCandidate,
        type: request.body.type
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.EVENTS, query, newValues).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Events not found");
    });
});

router.post('/type/edit', function(request, response, next) {
    let query = {
        name: request.body.name
    };
    let newValuesObject = {
        name: request.body.name
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.EVENT_TYPES, query, newValues).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Event types not found");
    });
});

router.post('/edit', upload.single('file'), function(request, response, next) {
    let query = {
        id: request.body.id
    };
    request.body.image = request.file ? request.file.filename : undefined;
    let newValuesObject = {
        id: request.body.id,
        events: request.body.events,
        dateModify: request.body.dateModify,
        company: request.body.company,
        description: request.body.description,
        image: request.body.image,
        isCandidate: request.body.isCandidate
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.EVENTS, query, newValues).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Events not found");
    });
});

router.post('/delete', function(request, response, next) {
    let query = {
        name: request.body.name
    };
    db.deleteFunction(db.COLLECTIONS.EVENT_TYPES, query).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Event types not found");
    });
});

router.post('/delete', function(request, response, next) {
    let query = {
        id: request.body.id
    };
    db.deleteFunction(db.COLLECTIONS.EVENTS, query).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Events not found");
    });
});

module.exports = router;
