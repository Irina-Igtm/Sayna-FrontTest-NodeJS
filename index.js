const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird')
const logger = require('winston')
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


const app = express();
const uri ='mongodb://localhost:27017/base_test';

//dbConnect
MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbase = db.db("mydb");
    dbase.createCollection("users", function(err, result) {
      if (err) throw err;
      console.log("Collection is created!");
      // close the connection to db when you are done with it
      db.close();
  });
  });

  // Access-Control *
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
