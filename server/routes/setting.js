var fs = require('fs'),
    crypto = require('crypto'),
    rs = require("randomstring");

exports.list = function (req, res) {

  try {
    req.db.query("SELECT * FROM admin", function (err, row, field){
      if (err) throw err;

      res.render('mainPage', {
        page: 'setting',
        mode: 'list',
        accounts: row
      });
    });
  } catch (ex) {
    console.error(ex);
  }
}

// 新增帳號頁面
exports.makeAccount = function (req, res) {
  try {
      res.render('mainPage', {
        page: 'setting',
        node: 'makeAccount'
      });
  } catch (ex) {
    console.error(ex);
  }
}

//儲存帳號
exports.makeAccountSave = function (req, res) {
  var name = req.body.name,
      account = req.body.account,
      password = req.body.password 

      console.log(password);

  try {
    var hash = crypto.createHash('md5');
    hash.update(password);
    var hashed = hash.digest('hex');
    var salt = rs.generate(8);
    hash = crypto.createHash('md5');
    hash.update(hashed + salt);
    var salted = hash.digest('hex');

    req.db.query("INSERT INTO admin (name, account, password, salt) VALUES (?, ?, ?, ?)", [name, account, salted, salt], function (err, result) {
      if (err) throw err;
    });

    res.redirect('/setting');
  } catch (ex) {
    console.error(ex);
  }
}

//刪除帳號
exports.deleteAccount = function (req, res) {
  var accountID = parseInt(req.params.acId, 10);

  if (isNaN(accountID)) {
    return res.json({
      status: 'invalid account id'
    })
  }

  try{
    req.db.query("SELECT COUNT(*) AS count FROM admin", function (err, row, field) {
      if (err) throw err;
      
      console.log(row[0].count);
      if(row[0].count > 1){
        req.db.query("DELETE FROM admin WHERE id = ?", [accountID], function (err, result) {
          if (err) throw err;
        });
        res.json({
          status: 'deleted'
        });
      }else{
        status: 'Can not delete the last one account'
      }
    });

  } catch (ex) {
    consol.error(ex);
  }

}

