var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var jsonfile = require('jsonfile');
var Promise = require('bluebird');

var url = "mongodb://localhost:27017/wifizone";
const args = process.argv;

function getJsonFileAndParse(path) {
  return new Promise(function(resolve, reject) {
    var voucherContainer = [];

    jsonfile.readFile(path, function(err, obj) {

      if (err) {
        console.log(err);
      }

      obj.forEach(function(item) {
        item.status = 'AVAILABLE';
        item.date_created = Date.now();
        item.date_printed = null;
        voucherContainer.push(item);
      });

      resolve(voucherContainer);
    })
  });
}


getJsonFileAndParse(args[2]).then(function(vouchers) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("wifizone");
    dbo.collection('vouchers').insertMany(vouchers, function(err, result) {
      console.log(result);
    });
  });
});
