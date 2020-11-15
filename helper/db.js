var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var dbo = undefined;
const COLLECTIONS = {
    USERS: 'users',
    COMPANIES: 'companies',
    PRODUCT_CATEGORIES: 'productCategories',
    PRODUCTS: 'products',
    HIGHLIGHT: 'highlight',
    EVENTS: 'events',
    BRANDS: 'brands',
    BLOGS: 'blogs',
    FACTORS: 'factors',
};

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("marketplace");
});

function find(collection, query, offset, length) {
    return new Promise((resolve, reject) => {
        if (dbo) {
            dbo.createCollection(collection, function (err, res) {

                if (offset && length) {
                    dbo.collection(collection).aggregate([
                        { "$facet": {
                                "totalData": [
                                    { "$match": query},
                                    { "$skip": parseInt(offset) },
                                    { "$limit": parseInt(length) }
                                ],
                                "totalCount": [
                                    { "$group": {
                                            "_id": null,
                                            "count": { "$sum": 1 }
                                        }}
                                ]
                            }}
                    ]).toArray(function (err, result) {
                        if (err) reject(err);
                        let finalResult = {
                            data: result[0].totalData,
                            totalCount: result[0].totalCount[0].count
                        };
                        resolve(finalResult);
                    })
                } else {
                    dbo.collection(collection).find(query).toArray(function (err, result) {
                        if (err) reject(err);
                        resolve(result);
                    });
                }

            });
        } else {
            reject();
        }
    });
}

function findNewest(collection, query) {
    return new Promise((resolve, reject) => {
        if (dbo) {
            dbo.createCollection(collection, function (err, res) {
                dbo.collection(collection).find(query).sort({"dateModify": -1}).limit(3).toArray(function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        } else {
            reject();
        }
    });
}

function insert(collection, dataObject) {
    return new Promise((resolve, reject) => {
        if (dbo) {
            dbo.createCollection(collection, function (err, res) {
                dbo.collection(collection).insertOne(dataObject, function(err, res) {
                    if (err) reject(err);
                    resolve(res);
                });
            });
        } else {
            reject();
        }
    });
}

function update(collection, updateQuery, newValues) {
    return new Promise((resolve, reject) => {
        if (dbo) {
            dbo.createCollection(collection, function (err, res) {
                dbo.collection(collection).updateOne(updateQuery, newValues, function(err, res) {
                    if (err) reject(err);
                    resolve(res);
                });
            });
        } else {
            reject();
        }
    });
}

function deleteFunction(collection, deleteQuery) {
    return new Promise((resolve, reject) => {
        if (dbo) {
            dbo.createCollection(collection, function (err, res) {
                dbo.collection(collection).deleteOne(deleteQuery, function(err, obj) {
                    if (err) reject(err);
                    resolve(res);
                });
            });
        } else {
            reject();
        }
    });
}

module.exports = {COLLECTIONS, find, findNewest, insert, update, deleteFunction};
