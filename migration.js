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
          {plan_code: 'A', price: 1, minutes: 10},
          {plan_code: 'C', price: 5, minutes: 60},
          {plan_code: 'D', price: 12, minutes: 180}
        ]

        dbo.collection('plans').insertMany(plans, function(err, response) {
          if (err) throw err;
          console.log("plans items are created!");

          dbo.collection("credit").insertOne( {total_credit: 0, status: 'MAIN'}, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted to credit");
            db.close();
          });
        });
      });

    });
  });
});
