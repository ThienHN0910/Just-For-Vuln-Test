const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Case 2: Lỗ hổng MỚI chưa từng có trong dataset (Kích hoạt sinh bản vá AI & Active Learning)
// Endpoint đích: GET /api/suppliers/reviews?vendor=
router.get('/reviews', async (req, res) => {
  const vendor = String(req.query.vendor || '');
  if (!/^[A-Za-z0-9-]{1,32}$/.test(vendor)) {
    return res.status(400).json({ error: 'Invalid vendor code' });
  }

  try {
    const pool = await getPool();
    const query = `SELECT Id, VendorCode, ReviewScore, Comments FROM SupplierReviews WHERE VendorCode = @vendor`;
    const result = await pool.request().input('vendor', vendor).query(query);
    res.json({ reviews: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vendor reviews' });
  }
});

module.exports = router;
