const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// ACVIS review test case TP-1: direct source to sink in one file.
router.get('/by-name', async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query(`SELECT * FROM Users WHERE Username = '${req.query.name}'`);
  res.json(result.recordset);
});

module.exports = router;
