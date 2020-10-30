var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

router.post('/list', function(request, response, next) {
    let filterData = {
        name: request.body.name,
        country: request.body.country,
        companyId: request.body.companyId,
        ownerName: request.body.ownerName,
        logo: request.body.logo,
        description: request.body.description,
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.COMPANIES, {}).then((companies) => {
        response.status(200).json(companies);
    }).catch(() => {
        response.status(409).send("Company not found");
    });
});

router.post('/insert', function(request, response, next) {
    let dataObject = {
        name: request.body.name,
        country: request.body.country,
        companyId: request.body.companyId,
        ownerName: request.body.ownerName,
        logo: request.body.logo,
        description: request.body.description,
    };
    db.insert(db.COLLECTIONS.COMPANIES, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("Company did not added");
    });
});

router.post('/edit', function(request, response, next) {
    let query = {
        companyId: request.body.companyId
    };
    let newValues = {
        name: request.body.newValue.name,
        country: request.body.newValue.country,
        ownerName: request.body.newValue.ownerName,
        logo: request.body.newValue.logo,
        description: request.body.newValue.description,
    };
    db.update(db.COLLECTIONS.COMPANIES, query, newValues).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Company not found");
    });
});

router.post('/delete', function(request, response, next) {
    let query = {
        companyId: request.body.companyId
    };
    db.deleteFunction(db.COLLECTIONS.COMPANIES, query).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Company not found");
    });
});

module.exports = router;
