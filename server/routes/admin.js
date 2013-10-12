var crypto = require('crypto'),
    apns = require("apn"),
    gcm = require('node-gcm'),
    errorCallback = function (err, notification) {
      console.error("Error: " + err);
    };

exports.login = function (req, res) {
  res.render('login')
}

exports.doLogin = function (req, res) {

  var account = req.body.account,
      password = req.body.password;

  if (account === '' || password === '') {
    res.redirect('/login?status=empty');
    return false;
  }

  try {
    req.db.query("SELECT * FROM admin WHERE account = ?", [account], function (err, row, field) {
      if (err) throw err;

      if (!row.length) {
        res.json({
          status: 'not found'
        });
        return false;
      }

      meta = row[0];
      md5sum = crypto.createHash('md5');
      hashed = md5sum.update(password);
      hashed = hashed.digest('hex');
      md5sum = crypto.createHash('md5');
      salted = md5sum.update(hashed + meta.salt);
      salted = md5sum.digest('hex');
      if (salted === meta.password) {
        req.session.admin = true;
        res.redirect('/');
      } else {
        res.redirect('/login?status=fail');
      }
    });
  } catch (ex) {
    res.json({
      status: 'system fail'
    });
  }
}

exports.mainPage = function (req, res) {
  res.render('mainPage', {
    page: 'home'
  });
}

exports.introduce = function (req, res) {
  var unitID = parseInt(req.params.unitId, 10) || 0
  if (isNaN(unitID)) unitID = 0;

  try {
    req.db.query("SELECT id AS thisId, name, photo, (SELECT master_id FROM unit WHERE id = ?) AS prev, (SELECT COUNT(*) FROM unit WHERE master_id = thisId) AS children FROM unit WHERE master_id = ?", [unitID, unitID], function (err, row, field){
      if (err) throw err;

      var queryId;

      if (unitID === 0) {
        queryId = -1
      } else {
        queryId = row.length ? row[0].prev : -1
      }

      if (row.length && req.path.match(/new/gi) === null) {
        // 資料夾模式
        res.render('mainPage', {
          page: 'introduce',
          mode: 'list',
          list: row,
          queryId: queryId,
          listId: unitID
        });
      } else {
        // 編輯文章模式
        req.db.query("SELECT *, (SELECT master_id FROM unit WHERE id = unit_id) AS master_id, (SELECT name FROM unit WHERE id = unit_id) AS name FROM introduce WHERE unit_id = ?", [unitID], function (err, row, field) {
          if (err) throw err;

          var article;

          if (row.length) {
            article = row[0].content;
            name = row[0].name;
            queryId = row[0].master_id;
          } else {
            article = '';
            name = '未知';
            queryId = 0;
          }

          target = req.path.match(/new/gi) === null ? 'exist' : 'new'

          res.render('mainPage', {
            page: 'introduce',
            mode: 'article',
            article: article,
            name: name,
            target: target,
            queryId: queryId
          });
        });
      }
    });
  } catch (ex) {
    console.error(ex);
  }
}

exports.updateIntroduce = function (req, res) {
  var unitID = parseInt(req.params.unitId, 10) || 0,
      article = req.body.article,
      title = req.body.title;

  if (isNaN(unitID) || unitID <= 0) {
    return res.json({
      status: 'invalid article id'
    })
  }

  try {
    req.db.query("INSERT INTO introduce (unit_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?", [unitID, article, article], function (err, result){
      if (err) throw err;
    });

    req.db.query("UPDATE unit SET name = ? WHERE id = ?", [title, unitID], function (err, result){
      if (err) throw err;
    });

    res.json({
      status: 'updated'
    });
  } catch (ex) {
    console.error(ex);
    res.json({
      status: 'server error'
    })
  }
}

exports.deleteIntroduce = function (req, res) {
  var unitID = parseInt(req.params.unitId, 10);

  if (isNaN(unitID)) {
    return res.json({
      status: 'invalid article id'
    })
  }

  try {
    req.db.query("SELECT COUNT(*) AS count FROM unit WHERE master_id = ?", [unitID], function (err, row, field) {
      if (err) throw err;
      
      if (row[0].count) {
        res.json({
          status: 'invalid article id'
        });
      } else {
        req.db.query("DELETE FROM unit WHERE id = ?", [unitID], function (err, result) {
          if (err) throw err;
        });
        res.json({
          status: 'deleted'
        });
      }
    });
  } catch (ex) {
    console.error(ex);
  }
}

exports.newIntroduce = function (req, res) {
  var unitID = parseInt(req.params.targetId, 10),
      article = req.body.article,
      title = req.body.title;

  if (isNaN(unitID)) {
    return res.json({
      status: 'invalid article id'
    })
  }

  try {
    req.db.query("INSERT INTO unit (name, master_id) VALUES (?, ?)", [title, unitID], function (err, result){
      if (err) throw err;
      req.db.query("INSERT INTO introduce (unit_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?", [result.insertId, article, article], function (err, result){
        if (err) throw err;
      });
    });

    res.json({
      status: 'added'
    });
  } catch (ex) {
    console.error(ex);
    res.json({
      status: 'server error'
    })
  }
}

// 推播主頁面
exports.push = function (req, res) {

  try {
    req.db.query("SELECT *, (SELECT name FROM notification_category WHERE notification_category.id = category_id) AS category FROM notification ORDER BY id DESC LIMIT 0, 100", function (err, row, field) {
      if (err) throw err;

      res.render('mainPage', {
        page: 'push',
        mode: 'list',
        notifications: row
      });
    });
  } catch (ex) {
    console.error(ex);
  }
}

// 新增推播
exports.makePush = function (req, res) {
  try {
    req.db.query("SELECT * FROM notification_category", function (err, row, field) {
      if (err) throw err;
      
      res.render('mainPage', {
        page: 'push',
        node: 'make',
        category: row
      });
    });
  } catch (ex) {
    console.error(ex);
  }

}

// 取得推播列表
exports.getPushList = function (req, res) {
  var category = req.params.categoryId, sql = '';

  if (category === null || category === undefined) {
    category = -1;
  }
  category = parseInt(category, 10)

  // Generate sql
  if (category === -1) {
    sql = "SELECT (SELECT name FROM notification_category WHERE id = category_id) AS category, message, id, push_time FROM notification WHERE status = 'pushed' ORDER BY id DESC"
  } else {
    sql = "SELECT (SELECT name FROM notification_category WHERE id = category_id) AS category, message, id, push_time FROM notification WHERE status = 'pushed' AND category_id = ? ORDER BY id DESC"
  }
  
  try {
    req.db.query(sql, [category], function (err, row, field) {
      if (err) throw err;

      res.json({
        status: 'success',
        list: row
      })
    });
  } catch (ex) {
    console.error(ex);
  }
}

// 取德推播資料
exports.getPushMsg = function (req, res) {
  var msgId = parseInt(req.params.msgId, 10);

  if (isNaN(msgId) || msgId <= 0) {
    res.json({
      status: 'null'
    });
  } else {
    try {
      req.db.query("SELECT *, (SELECT name FROM notification_category WHERE id = category_id) AS category FROM notification WHERE status = 'pushed' AND id = ?", msgId, function (err, row, field) {
        if (err) throw err;

        if (row.length) {
          res.json({
            status: 'msg',
            message: row[0]
          });
        } else {
          res.json({
            status: 'null'
          });
        }
      });
    } catch (ex) {
      console.error(ex);
    }
  }
}

// 記錄新推播
exports.makePushSave = function (req, res) {
  var category = req.body.category,
      message = req.body.message,
      article = req.body.article;

  try {
    req.db.query("INSERT INTO notification (category_id, message, article) VALUES (?, ?, ?)", [category, message, article], function (err, result) {
      if (err) throw err;
    });

    res.redirect('/push');
  } catch (ex) {
    console.error(ex);
  }

}

// 推送通知
exports.pushMsg = function (req, res) {
  var msgId = parseInt(req.params.msgId, 10);

  if (isNaN(msgId) || msgId <= 0) {
    res.json({
      status: 'invaild push id'
    });
    return false;
  }

  var options = {
    cert: "./cert/cert.pem",
    key: "./cert/key.pem",
    gateway: 'gateway.sandbox.push.apple.com',
    port: 2195,
    errorCallback: errorCallback
  };
  var apnsConnection = new apns.Connection(options);

  var iosTokens = [];
  var androidTokens = [];

  // Fetch Tokens
  try {
    req.db.query("SELECT token, type FROM notification_token", function (err, row, field) {
      if (err) throw err;

      for (var i = 0; i < row.length; i += 1) {
        if (row[i].type === 'ios') {
          iosTokens.push(row[i].token);
        } else {
          androidTokens.push(row[i].token);
        }
      }

      req.db.query("SELECT * FROM notification WHERE id = ?", [msgId], function (err, row, field) {

        if (row.length) {
      
          // APN Send
          var note = new apns.Notification();

          note.expiry = Math.floor(Date.now() / 1000) + 3600 // 1hr
          note.badge = 1;
          note.sound = "ping.aiff"
          note.alert = row[0].message
          note.payload = {
            messageFrom: '/api/push/' + msgId,
            messageId: msgId
          }

          apnsConnection.pushNotification(note, iosTokens);

          // Android GCM Service
          var sender = new gcm.Sender('1033044943941');

          var message = new gcm.Message();
          message.addDataWithKeyValue('message', row[0].message);
          message.addDataWithKeyValue('pushId', msgId);

          sender.send(message, androidTokens, 4, function (err, result) {
            if (err) console.error(err);
            console.info(result);
          });

          // Update Status
          req.db.query("UPDATE notification SET status = 'pushed', push_time = now() WHERE id = ?", [msgId], function (err, result) {
            if (err) throw err;
          });

          res.json({
            status: 'pushed'
          });
        } else {
          res.json({
            status: 'invaild push msg id'
          });
        }
      });
    });
  } catch (ex) {
    console.error(ex);
  }

  var token = "8d6a67068b6affda87d44ddb11d96001949c3683e1b70959671cec32f784359f";
  
}