var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var emv = require('serial-number');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(url, function(err, db) {
  var dbo = db.db("wifizone");

  dbo.collection("emv").findOne({status:'MAIN'}, function(err, res) {
    emv(function (err, value) {
      if (value == res.val) {
        app.use('/', require('./routes/index'));

        require('./routes/credits')(app, dbo);
        require('./routes/vouchers')(app, dbo);
        require('./routes/plans')(app, dbo);
        console.log('EMV serial is verified');
      } else {
        console.log('Application cannot run, contact your administrtor.');
      }
    });
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!');
})


module.exports = app;
