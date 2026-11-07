const express = require('express');
const router = express.Router();

router.get('/rh', (req, res) => {
  res.send(`<div>${req.query.msg}</div>`);
});

module.exports = router;
