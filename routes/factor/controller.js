var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

router.get('/list', function(request, response, next) {
    let filterData = {
        trackingCode: request.query.trackingCode,
        username: request.query.username,
        phoneNumber: request.query.phoneNumber,
        address: request.query.address,
        transferType: request.query.transferType,
        transferCost: request.query.transferCost,
        totalCost: request.query.totalCost,
        totalDiscount: request.query.totalDiscount,
        payableAmount: request.query.payableAmount,
        fromTransferDateTime: request.query.fromTransferDateTime,
        toTransferDateTime: request.query.fromTransferDateTime,
        paymentGateway: request.query.paymentGateway,
        paymentTrackingCode: request.query.paymentTrackingCode,
        paymentDateTime: request.query.paymentDateTime,
        products: request.query.products,
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.FACTORS, {}).then((companies) => {
        response.status(200).json(companies);
    }).catch(() => {
        response.status(409).send("Factor not found");
    });
});

router.post('/insert', function(request, response, next) {
    let dataObject = {
        trackingCode: request.body.trackingCode,
        username: request.body.username,
        phoneNumber: request.body.phoneNumber,
        address: request.body.address,
        transferType: request.body.transferType,
        transferCost: request.body.transferCost,
        totalCost: request.body.totalCost,
        totalDiscount: request.body.totalDiscount,
        payableAmount: request.body.payableAmount,
        fromTransferDateTime: request.body.fromTransferDateTime,
        toTransferDateTime: request.body.fromTransferDateTime,
        paymentGateway: request.body.paymentGateway,
        paymentTrackingCode: request.body.paymentTrackingCode,
        paymentDateTime: request.body.paymentDateTime,
        products: request.body.products,
    };
    db.insert(db.COLLECTIONS.FACTORS, dataObject).then((res) => {
        response.status(200).json(res);
    }).catch(() => {
        response.status(409).send("Factor did not added");
    });
});

router.post('/edit', function(request, response, next) {
    let query = {
        trackingCode: request.body.trackingCode,
    };
    let newValues = {
        username: request.body.username,
        phoneNumber: request.body.phoneNumber,
        address: request.body.address,
        transferType: request.body.transferType,
        transferCost: request.body.transferCost,
        totalCost: request.body.totalCost,
        totalDiscount: request.body.totalDiscount,
        payableAmount: request.body.payableAmount,
        fromTransferDateTime: request.body.fromTransferDateTime,
        toTransferDateTime: request.body.fromTransferDateTime,
        paymentGateway: request.body.paymentGateway,
        paymentTrackingCode: request.body.paymentTrackingCode,
        paymentDateTime: request.body.paymentDateTime,
        products: request.body.products,
    };
    db.update(db.COLLECTIONS.FACTORS, query, newValues).then((factors) => {
        response.status(200).json(factors);
    }).catch(() => {
        response.status(409).send("Factor not found");
    });
});

router.post('/delete', function(request, response, next) {
    let query = {
        trackingCode: request.body.trackingCode,
    };
    db.deleteFunction(db.COLLECTIONS.FACTORS, query).then((factors) => {
        response.status(200).json(factors);
    }).catch(() => {
        response.status(409).send("Factor not found");
    });
});

module.exports = router;
