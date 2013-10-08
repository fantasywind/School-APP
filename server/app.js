
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var auth = require('./routes/auth.js');
var admin = require('./routes/admin.js');
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
app.set('port', process.env.PORT || 9003);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  req.db = conn;

  // Login Check
  if (req.path.match(/api/ig) === null && req.path !== '/login') {
    if (req.session.admin === undefined) {
      res.redirect('/login');
    } else {
      next();
    }
  } else if (req.path === '/login' && req.session.admin === true) {
    res.redirect('/');
  } else {
    next();
  }
});
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/api/login', auth.login);
app.post('/api/anonymous', auth.anonymous);
app.get('/login', admin.login);
app.post('/login', admin.doLogin);
app.get('/', admin.mainPage);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
