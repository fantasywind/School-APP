exports.introduce = function (req, res) {

  unitID = parseInt(req.params.unitId, 10) || 0
  if (isNaN(unitID)) unitID = 0;

  try {
    req.db.query("SELECT id, name, photo FROM unit WHERE master_id = ? ORDER BY sort", [unitID], function (err, row, field) {
      if (err) throw err;

      if (row.length) {
        res.json({
          status: 'list',
          list: row
        });
      } else {
        req.db.query("SELECT *, (SELECT name FROM unit WHERE id = unit_id) AS title FROM introduce WHERE unit_id = ?", [unitID], function (err, row, field) {
          if (err) throw err;

          if (row.length) {
            res.json({
              status: 'introduce',
              title: row[0].title,
              content: row[0].content
            });
          } else {
            res.json({
              status: 'introduce',
              content: ''
            });
          }
        });
      }
    });
  } catch (ex) {
    console.error(ex);
    res.json({
      status: 'server error'
    });
  }
}

// 註冊推播 Token
exports.registerPush = function (req, res) {
  var token = req.body.token,
      type = req.body.type;

  if (req.session.uid === undefined) {
    res.json({
      status: 'login plz'
    })
    return false;
  }

  try {
    req.db.query("INSERT INTO notification_token (type, token, member_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?", [type, token, req.session.uid, token], function (err, row, field) {
      if (err) throw err
    });
    res.json({
      status: 'registered'
    })
  } catch (ex) {
    console.error(ex);
  } 
}

exports.pushCategory = function (req, res) {

  try {
    req.db.query("SELECT *, (SELECT COUNT(*) FROM notification WHERE category_id = notification_category.id) AS count FROM notification_category ORDER BY count DESC", function (err, row, field) {
      if (err) throw err;

      res.json({
        status: 'success',
        category: row
      });
    });
  } catch (ex) {
    console.error(ex);
  }
}

exports.getChatList = function (req, res) {

  try {
    req.db.query("SELECT group_id AS id, (SELECT name FROM group WHERE id = group_id) AS name FROM member_group WHERE member_id = ?", [req.session.uid], function (err, row, field) {
      if (err) throw err;
      res.json({
        status: 'success',
        list: row
      });
    });
  } catch (ex) {
    console.error(ex);
  }
}