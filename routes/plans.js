module.exports = function(app, db) {

  const contextPath = '/plans'

  app.get(contextPath, function(req, res) {
    db.collection("plans").find({})
      .toArray(function(err, response) {
        res.json(response);
      })
  })

};
