
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var auth = require('./routes/auth.js')
var http = require('http');
var path = require('path');
var app = express();


var config = require("./config.json"),
    mysql = require("mysql"),
    conn = mysql.createConnection({
      host: config.host,
      user: config.account,
      password: config.password,
      database: 'schoolapp'
    });

conn.connect();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(function(req, res, next){
  req.db = conn;
  next();
});
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/login', auth.login);
app.post('/anonymous', auth.anonymous);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
