const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Storefront search box: find products by keyword
router.get('/search', async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const pool = await getPool();
    const sql = `SELECT * FROM Products WHERE Name LIKE '%${keyword}%'`;
    const result = await pool.request().query(sql);
    res.json({ products: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Product search failed' });
  }
});

module.exports = router;
