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

router.get('/search', function (request, response, next) {
    let filterData = {
        name: request.query.name ? { "$regex": request.query.name, "$options": "i" } : undefined,
        brand: request.query.brand ? { "$regex": request.query.brand, "$options": "i" } : undefined,
        masterCategory: request.query.masterCategory ? { "$regex": request.query.masterCategory, "$options": "i" } : undefined,
        type: request.query.type ? { "$regex": request.query.type, "$options": "i" } : undefined,
        subType: request.query.subType ? { "$regex": request.query.subType, "$options": "i" } : undefined
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.PRODUCTS, filterData, request.query.offset, request.query.length).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Product not found");
    });
});

router.get('/list', function (request, response, next) {
    let filterData = {
        serialNumber: request.query.serialNumber,
        name: request.query.name,
        company: request.query.company === 'admin' ? undefined : request.query.company,
        description: request.query.description,
        image: request.query.image,
        price: request.query.price,
        discount: request.query.discount,
        masterCategory: request.query.masterCategory,
        type: request.query.type,
        subType: request.query.subType,
        dateModify: request.query.dateModify,
        comments: request.query.comments,
        brand: request.query.brand,
        colors: request.query.colors,
        totalCount: request.query.totalCount,
        existCount: request.query.existCount,
        rate: request.query.rate,
        properties: request.query.properties,
        isBestSeller: request.query.isBestSeller
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.PRODUCTS, filterData, request.query.offset, request.query.length).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Product not found");
    });
});

router.get('/newCollection', function (request, response, next) {
    let filterData = {
        serialNumber: request.query.serialNumber,
        name: request.query.name,
        company: request.query.company === 'admin' ? undefined : request.query.company,
        description: request.query.description,
        image: request.query.image,
        price: request.query.price,
        discount: request.query.discount,
        masterCategory: request.query.masterCategory,
        type: request.query.type,
        subType: request.query.subType,
        dateModify: request.query.dateModify,
        comments: request.query.comments,
        brand: request.query.brand,
        colors: request.query.colors,
        totalCount: request.query.totalCount,
        existCount: request.query.existCount,
        rate: request.query.rate,
        properties: request.query.properties,
        isBestSeller: request.query.isBestSeller
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.findNewest(db.COLLECTIONS.PRODUCTS, filterData).then((products) => {
        response.status(200).json(products);
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

router.post('/insert', upload.single('file'), function (request, response, next) {
    request.body.image = request.file.filename;
    let dataObject = {
        serialNumber: request.body.serialNumber,
        name: request.body.name,
        company: request.body.company,
        description: request.body.description,
        image: request.body.image,
        price: request.body.price,
        discount: request.body.discount,
        masterCategory: request.body.masterCategory,
        type: request.body.type,
        subType: request.body.subType,
        dateModify: request.body.dateModify,
        comments: request.body.comments,
        brand: request.body.brand,
        colors: request.body.colors,
        totalCount: request.body.totalCount,
        existCount: request.body.existCount,
        rate: request.body.rate,
        properties: request.body.properties,
        isBestSeller: request.body.isBestSeller
    };
    db.insert(db.COLLECTIONS.PRODUCTS, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("Product did not added");
    });
});

router.post('/edit', upload.single('file'), function (request, response, next) {
    let query = {
        serialNumber: request.body.serialNumber
    };
    request.body.image = request.file ? request.file.filename : undefined;
    let newValuesObject = {
        serialNumber: request.body.serialNumber,
        name: request.body.name,
        company: request.body.company,
        description: request.body.description,
        price: request.body.price,
        discount: request.body.discount,
        masterCategory: request.body.masterCategory,
        type: request.body.type,
        subType: request.body.subType,
        dateModify: request.body.dateModify,
        comments: request.body.comments,
        brand: request.body.brand,
        colors: request.body.colors,
        totalCount: request.body.totalCount,
        existCount: request.body.existCount,
        rate: request.body.rate,
        properties: request.body.properties,
        image: request.body.image,
        isBestSeller: request.body.isBestSeller
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.PRODUCTS, query, newValues).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Product not found");
    });
});

router.post('/delete', function (request, response, next) {
    let query = {
        serialNumber: request.body.serialNumber
    };
    db.deleteFunction(db.COLLECTIONS.PRODUCTS, query).then((products) => {
        response.status(200).json(products);
    }).catch(() => {
        response.status(409).send("Product not found");
    });
});

module.exports = router;
