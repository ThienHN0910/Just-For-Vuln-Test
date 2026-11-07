const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

router.get('/mc', async (req, res) => {
  const pool = await getPool();
  const r = await pool.request().query(`SELECT * FROM Users WHERE Email = '${req.query.email}'`);
  res.json(r.recordset);
});

module.exports = router;
