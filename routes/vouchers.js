var Promise = require('bluebird');

module.exports = function(app, db) {

  const contextPath = '/vouchers'

  app.get(contextPath + '/verify/:plan', function(req, res) {
    var plan = req.params.plan;
    db.collection("vouchers").count({plan: plan, status: 'AVAILABLE'}, function(err, response) {
      res.json(response);
    });
  })

  app.post(contextPath + '/:plan', function(req, res) {
    var planParam = req.params.plan;

    db.collection('plans').findOne({ plan_code: planParam }, function(err, plan) {
      db.collection('credit').findOne({ status: 'MAIN' }, function(err, credit) {
        if (credit.total_credit < plan.price || credit.total_credit <= 0 ) {
          res.status(403).send({ message: 'CREDIT NOT SUFFICIENT' })
        } else {
          db.collection("vouchers").find({plan: plan.plan_code, status: 'AVAILABLE'}).toArray(function(err, response) {
            var data = response[0];

            db.collection('vouchers').updateOne({ _id: data._id },
              { $set: { status: 'PRINTED', date_printed: Date.now() } }, function(err, response) {
                var newTotalCredit = parseInt(credit.total_credit) - parseInt(plan.price);
                db.collection('credit').updateOne({ _id: credit._id },
                  { $set: { total_credit: newTotalCredit } }, function(err, response) {
                    res.json(data);
                })
            })
          });

        }
      });
    })



  });

};
