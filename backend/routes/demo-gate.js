const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Merge gate demo — price filter for the product listing (introduced on a feature branch)
router.get('/under-price', async (req, res) => {
  const maxPrice = req.query.max;

  try {
    const pool = await getPool();
    const sql = `SELECT * FROM Products WHERE Price <= ${maxPrice}`;
    const result = await pool.request().query(sql);
    res.json({ products: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Price filter failed' });
  }
});

module.exports = router;
