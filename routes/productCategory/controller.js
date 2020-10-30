var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

router.get('/list', function(request, response, next) {
    db.find(db.COLLECTIONS.PRODUCT_CATEGORIES).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

router.post('/insert', function(request, response, next) {

    let dataObject = {
        type: request.body.type,
        description: request.body.description,
        moreInformation: request.body.moreInformation,
    };


    db.insert(db.COLLECTIONS.PRODUCT_CATEGORIES, dataObject).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Product category did not added");
    });
});

router.post('/edit', function(request, response, next) {
    let query = {
        type: request.body.type
    };
    let newValues = {
        type: request.body.type,
        description: request.body.description,
        moreInformation: request.body.moreInformation
    };
    db.update(db.COLLECTIONS.PRODUCT_CATEGORIES, query, newValues).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Product not found");
    });
});

router.post('/delete', function(request, response, next) {
    let query = {
        type: request.body.type
    };
    db.deleteFunction(db.COLLECTIONS.PRODUCT_CATEGORIES, query).then((productCategories) => {
        response.status(200).json(productCategories);
    }).catch(() => {
        response.status(409).send("Product not found");
    });
});

module.exports = router;
