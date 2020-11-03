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
        id: request.query.id,
        contentImage: request.query.contentImage,
        products: request.query.products,
        summeryContent: request.query.summeryContent,
        content: request.query.content
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.HIGHLIGHT, filterData).then((highlights) => {
        response.status(200).json(highlights);
    }).catch(() => {
        response.status(409).send("Product not found");
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

router.post('/uploadImage', upload.single('file'), function (request, response, next) {
    response.status(200).json(request.file.filename);
});

router.post('/insert', function (request, response, next) {
    let dataObject = {
        id: request.body.id,
        contentImage: request.body.contentImage,
        products: request.body.products,
        content: request.body.content,
        summeryContent: request.body.summeryContent
    };
    db.insert(db.COLLECTIONS.HIGHLIGHT, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("Highlight did not added");
    });
});

router.post('/edit', function (request, response, next) {
    let query = {
        id: request.body.id
    };
    let newValuesObject = {
        contentImage: request.body.contentImage,
        products: request.body.products,
        summeryContent: request.body.summeryContent,
        content: request.body.content
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.HIGHLIGHT, query, newValues).then((highlights) => {
        response.status(200).json(highlights);
    }).catch(() => {
        response.status(409).send("Highlight not found");
    });
});

router.post('/delete', function (request, response, next) {
    let query = {
        id: request.body.id
    };
    db.deleteFunction(db.COLLECTIONS.HIGHLIGHT, query).then((highlights) => {
        response.status(200).json(highlights);
    }).catch(() => {
        response.status(409).send("Highlight not found");
    });
});

module.exports = router;
