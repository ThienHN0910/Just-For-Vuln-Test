const express = require('express');
const router = express.Router();
const { clean } = require('../helpers/clean');

router.get('/greet', (req, res) => {
  res.send(`<p>${clean(req.query.name)}</p>`);
});

module.exports = router;
