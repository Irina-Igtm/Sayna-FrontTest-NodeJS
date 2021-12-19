var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/base_test"; 
var assert = require('assert');

var connection=[];
// Create the database connection
establishConnection = function(callback){

                MongoClient.connect(url, { poolSize: 10 },function(err, db) {
                    assert.equal(null, err);

                        connection = db
                        if(typeof callback === 'function' && callback())
                            callback(connection)

                    }

                )



}

function getconnection(){
    return connection
}

module.exports = {

    establishConnection:establishConnection,
    getconnection:getconnection
}


//you can also call with callback if you wanna create any collection at starting
/*
db.establishConnection(function(conn){
  conn.createCollection("collectionName", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });
};
*/

// anyother route.js

// var db = require('./mongo')

// router.get('/', function(req, res, next) {
//     var connection = db.getconnection()
//     res.send("Hello");

// });