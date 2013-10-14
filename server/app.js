
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var auth = require('./routes/auth.js');
var admin = require('./routes/admin.js');
var api = require('./routes/api.js');
var member = require('./routes/member.js');
var setting = require('./routes/setting.js');
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
app.get('/api/introduce', api.introduce);
app.get('/api/introduce/:unitId', api.introduce);
app.get('/api/push/category', api.pushCategory);
app.get('/api/push/list', admin.getPushList);
app.get('/api/push/list/:categoryId', admin.getPushList);
app.get('/api/push/:msgId', admin.getPushMsg);
app.get('/login', admin.login);
app.post('/login', admin.doLogin);
app.get('/', admin.mainPage);
app.get('/introduce', admin.introduce);
app.get('/introduce/:unitId', admin.introduce);
app.get('/introduce/new/:unitId', admin.introduce);
app.post('/introduce/new/:targetId', admin.newIntroduce);
app.post('/introduce/:unitId', admin.updateIntroduce);
app.delete('/introduce/:unitId', admin.deleteIntroduce);
app.post('/api/push/register', api.registerPush);
app.get('/push', admin.push);
app.post('/push', admin.makePushSave);
app.get('/push/new', admin.makePush);
app.post('/push/:msgId', admin.pushMsg);
app.get('/member', member.list);
app.post('/member', member.addMembers);
app.get('/setting', setting.list);
app.get('/setting/new', setting.makeAccount);
app.post('/setting', setting.makeAccountSave);
app.delete('/setting/:acId', setting.deleteAccount);
app.get('/logout',admin.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
