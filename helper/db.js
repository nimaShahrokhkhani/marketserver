var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var dbo = undefined;
const COLLECTIONS = {
    USERS: 'users',
    COMPANIES: 'companies',
    PRODUCTS: 'products'
};

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("marketplace");
});

function find(collection, query) {
    return new Promise((resolve, reject) => {
        if (dbo) {
            dbo.createCollection(collection, function (err, res) {
                dbo.collection(collection).find(query).toArray(function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        } else {
            reject();
        }
    });
}

module.exports = {COLLECTIONS, find};
