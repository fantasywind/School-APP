var config = require("../config.json"),
    crypto = require("crypto"),
    mysql = require("mysql"),
    conn = mysql.createConnection({
      host: config.host,
      user: config.account,
      password: config.password,
      database: 'schoolapp'
    });

console.dir (config)
conn.connect();

exports.login = function (req, res) {
  var account, password;

  account = req.body.account;
  password = req.body.password;

  conn.query("SELECT password, salt FROM member WHERE account = ?", [account], function(err, row, field){
    if (err) throw err;

    if (row.length) {
      console.dir(row)
    }

  })

}