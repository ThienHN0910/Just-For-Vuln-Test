const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

router.get('/proven', async (req, res) => {
  const pool = await getPool();
  const rows = await pool.request().query(`SELECT * FROM Products WHERE Name = '${req.query.name}'`);
  res.json(rows.recordset);
});

module.exports = router;
