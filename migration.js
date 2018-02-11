var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/wifizone";

MongoClient.connect(url, function(err, db) {
  var dbo = db.db("wifizone");

  dbo.createCollection("credit", function(err, res) {
    if (err) throw err;
    console.log("credit collection is created!");

    dbo.createCollection("vouchers", function(err, res) {
      if (err) throw err;
      console.log("voucher collection is created!");

      dbo.createCollection("plans", function(err, res) {
        if (err) throw err;
        console.log("plans collection is created!");

        var plans = [
          {plan_code: 'A', price: 5, minutes: 60, label: '1 HOUR'},
          {plan_code: 'B', price: 10, minutes: 180, label: '3 HOURS'},
          {plan_code: 'C', price: 30, minutes: 1440, , label: '1 DAY'}
        ]

        dbo.collection('plans').insertMany(plans, function(err, response) {
          if (err) throw err;
          console.log("plans items are created!");

          dbo.collection("credit").insertOne( {total_credit: 0, status: 'MAIN'}, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted to credit");

            dbo.createCollection("emv", function(err, res) {
              dbo.collection("emv").insertOne({ val: null, status: 'MAIN' }, function(err, res) {
                db.close();
              });
            });
          });
        });
      });

    });
  });
});
