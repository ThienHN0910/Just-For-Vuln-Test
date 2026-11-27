const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Storefront: list products of one brand for the coupon banner.
// GET /api/coupons/brand?brand=
router.get('/brand', async (req, res) => {
  const brand = req.query.brand;

  try {
    const pool = await getPool();
    const query = `SELECT Id, Name, Price FROM Products WHERE Name LIKE '%${brand}%'`;
    const result = await pool.request().query(query);
    res.json({ products: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load brand products' });
  }
});

module.exports = router;
