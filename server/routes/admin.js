crypto = require('crypto');

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