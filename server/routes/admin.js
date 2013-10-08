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
  res.render('mainPage');
}