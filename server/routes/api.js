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
        req.db.query("SELECT * FROM introduce WHERE unit_id = ?", [unitID], function (err, row, field) {
          if (err) throw err;

          if (row.length) {
            res.json({
              status: 'introduce',
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