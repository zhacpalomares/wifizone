

module.exports = function(app, db) {

  const contextPath = '/credits'

  app.get(contextPath, function(req, res) {
    db.collection("credit").findOne(
      { status: 'MAIN' }, function(err, result) {
      res.json(result);
    });
  });

  app.post(contextPath, function(req, res) {
    var coin = req.body.coin;

    console.log(req.body);

    db.collection("credit").findOne(
      { status: 'MAIN' }, function(err, result) {
        var totalCredit = parseInt(coin) + parseInt(result.total_credit);

        db.collection("credit").updateOne(
          {_id: result._id },
          { $set: { total_credit: totalCredit} },
          function(err, response) {
            res.json(response);
        });
    });
  });

};
