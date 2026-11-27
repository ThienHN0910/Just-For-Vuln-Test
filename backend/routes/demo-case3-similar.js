const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Case 3: Lỗ hổng TƯƠNG TỰ Case 2 (Chứng minh học chủ động - Active Learning sau khi Case 2 được lưu vào dataset)
// Endpoint đích: GET /api/vendors/ratings?vendor=
router.get('/ratings', async (req, res) => {
  const vendor = String(req.query.vendor || '');
  if (!/^[A-Za-z0-9-]{1,32}$/.test(vendor)) {
    return res.status(400).json({ error: 'Invalid vendor code' });
  }

  try {
    const pool = await getPool();
    const query = `SELECT Id, VendorCode, RatingGrade, FeedbackNote FROM VendorRatings WHERE VendorCode = @vendor`;
    const result = await pool.request().input('vendor', vendor).query(query);
    res.json({ ratings: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vendor ratings' });
  }
});

module.exports = router;
