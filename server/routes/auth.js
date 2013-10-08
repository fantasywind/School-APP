var crypto = require("crypto");

exports.login = function (req, res) {
  var account, password;

  account = req.body.account;
  password = req.body.password;

  try {
    req.db.query("SELECT id, name, account, password, salt FROM member WHERE account = ?", [account], function(err, row, field){
      if (err) throw err;

      if (row.length) {
        data = row[0];
        md5sum = crypto.createHash("md5");
        hashed = md5sum.update(password);
        hashed = hashed.digest("hex") + data.salt;
        md5sum = crypto.createHash("md5");
        salted = md5sum.update(hashed);
        salted = salted.digest("hex");
        if (salted === data.password) {
          req.session.uid = data.id;
          req.session.name = data.name;
          req.session.account = data.account;
          res.json({
            status: 'logined'
          });
        } else {
          res.json({
            status: 'failed'
          });
        }
      } else {
        res.json({
          status: 'not found'
        });
      }
    });
  } catch (ex) {
    res.json({
      status: 'server error'
    });
  }
}

exports.anonymous = function (req, res) {
  var mail = req.body.mail;

  try {
    req.db.query("INSERT INTO anonymous (mail) VALUES (?)", [mail], function (err, result) {
      if (err) throw err;
      res.json({
        status: 'added'
      })
    })
  } catch (ex) {
    res.json({
      status: 'existed'
    });
  }
}