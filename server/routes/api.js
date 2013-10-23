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

// 聊天群組列表
exports.getChatList = function (req, res) {
  member_id = req.query.uid
  
  try {
    req.db.query("SELECT group_id AS id, (SELECT name FROM `group` WHERE id = group_id) AS name FROM member_group WHERE member_id = ?", [member_id], function (err, row, field) {
      if (err) throw err;
      res.json({
        status: 'success',
        list: row
      });
    });
  } catch (ex) {
    console.error(ex);
    res.json({
      status: 'fail'
      code: -1
      msg: 'Server Fault'
    });
  }
}

// 聊天內容
exports.getChatContent = function (req, res) {
  from = parseInt(req.query.from, 10) || 0
  groupId = req.params.groupId or -1

  if (groupId === -1 || isNaN(parseInt(groupId, 10)) || isNaN(from)) {
    return res.json({
      status: 'fail'
      code: 0
      msg: 'Invalid Parameter'
    });
  }

  try {
    req.db.query("SELECT *, (SELECT name FROM member WHERE member.id = sender) AS sender_name FROM message WHERE target_group = ? ORDER BY send_time DESC LIMIT ?, ?", [groupId, from, from + 20], function (err, row, field) {
      if (err) throw err;

      res.json({
        status: 'success'
        message: row
      });
    });
  } catch (ex) {
    console.error(ex.toString());
    res.json({
      status: 'fail'
      code: -1
      msg: 'Server Fault'
    });
  }
}