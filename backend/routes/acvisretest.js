const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

router.get('/lookup', async (req, res) => {
  const pool = await getPool();
  const rows = await pool.request().query(`SELECT * FROM Users WHERE Name = '${req.query.name}'`);
  res.json(rows.recordset);
});

module.exports = router;
