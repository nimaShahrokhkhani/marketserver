var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var dbo = undefined;
const COLLECTIONS = {
  USERS: 'users'
};

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("marketplace");
    dbo.createCollection("users", function(err, res) {
        if (!err) {
            console.log("Collection created!");
            //db.close();
        }
    });
});

function find(collection, query) {
    return new Promise((resolve, reject) => {
        if (dbo) {
            dbo.collection(collection).find(query).toArray(function(err, result) {
                if (err || result.length === 0) reject(err);
                resolve(result);
            });
        } else {
            reject();
        }
    });
}

module.exports = {COLLECTIONS, find};
