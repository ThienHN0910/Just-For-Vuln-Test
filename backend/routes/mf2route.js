const express = require('express');
const router = express.Router();
const { searchUsers } = require('../services/userSearch');

router.get('/admin-search', async (req, res) => {
  const rows = await searchUsers(req.body.term);
  res.json(rows);
});

module.exports = router;
