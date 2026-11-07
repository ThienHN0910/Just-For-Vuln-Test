const fs = require('fs');
module.exports = (req, res) => res.send(fs.readFileSync('/srv/' + req.query.file));
