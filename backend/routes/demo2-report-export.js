const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Reporting dashboard: export the products of one category
router.get('/export', async (req, res) => {
  const category = req.query.category;

  try {
    const pool = await getPool();
    const sql = `SELECT * FROM Products WHERE Category = '${category}'`;
    const result = await pool.request().query(sql);
    res.json({ rows: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Report export failed' });
  }
});

module.exports = router;
