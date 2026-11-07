const express = require('express');
const router = express.Router();
const { searchUsers } = require('../services/userSearch');

router.get('/search', async (req, res) => {
  const rows = await searchUsers(req.query.term);
  res.json(rows);
});

module.exports = router;
