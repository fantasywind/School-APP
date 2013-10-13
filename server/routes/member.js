var fs = require('fs'),
    crypto = require('crypto'),
    rs = require("randomstring");

exports.list = function (req, res) {

  try {
    req.db.query("SELECT *, (SELECT type FROM role WHERE id = role_id) AS role FROM member", function (err, row, field){
      if (err) throw err;

      res.render('mainPage', {
        page: 'member',
        mode: 'list',
        members: row
      });
    });
  } catch (ex) {
    console.error(ex);
  }
}

exports.addMembers = function (req, res) {
  var csv = req.files.list,
      role = req.body.role,
      csvStr = fs.readFileSync(csv.path, {encoding: 'utf8'}),
      list = csvStr.split(/\n/g);

  if (role === undefined) role = 1;

  for (var i = 0; i < list.length; i += 1) {
    var profile = list[i].split(/,/g);
    if (profile.length === 3) {
      try {
        var hash = crypto.createHash('md5');
        hash.update(profile[1]);
        var hashed = hash.digest('hex');
        var salt = rs.generate(10);
        hash = crypto.createHash('md5');
        hash.update(hashed + salt);
        var salted = hash.digest('hex');
        req.db.query("INSERT INTO member (role_id, name, account, password, salt) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name", [role, profile[2], profile[0], salted, salt], function (err, result){
          if (err) throw err;
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  res.redirect('/member');
}