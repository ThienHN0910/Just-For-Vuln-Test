const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Get all products or search (VULNERABILITY: SQL Injection stacked query support)
router.get('/', async (req, res) => {
  const search = req.query.search || '';
  const category = req.query.category || '';

  try {
  const pool = await getPool();
  const request = pool.request();

  let query = 'SELECT * FROM Products';

  if (category) {
    // Parameterized: Ràng buộc kiểu dữ liệu NVarChar
    request.input('category', category);
    query = 'SELECT * FROM Products WHERE Category = @category';
  } else if (search) {
    // Ghép wildcard (%) trực tiếp vào giá trị tham số, KHÔNG ghép vào câu lệnh SQL
    request.input('searchTerm', `%${search}%`);
    query = 'SELECT * FROM Products WHERE Name LIKE @searchTerm OR Description LIKE @searchTerm';
  }

  const result = await request.query(query);

  return res.json({
    searchTerm: search || null,
    category: category || null,
    products: result.recordset || []
  });
} catch (err) {
  // Ghi log chi tiết ra server-side console/file cho mục đích audit & debug
  console.error('[DATABASE_ERROR]:', err);

  // Chỉ trả về thông báo lỗi chung chung (Generic message) cho client
  return res.status(500).json({ 
    error: 'An internal server error occurred while processing your request.' 
  });
}
});

// Get single product details & its reviews
router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const pool = await getPool();
    const prodResult = await pool.request().query(`SELECT * FROM Products WHERE Id = ${productId}`);
    const reviewsResult = await pool.request().query(
      `SELECT r.*, u.Username FROM Reviews r JOIN Users u ON r.UserId = u.Id WHERE r.ProductId = ${productId}`
    );

    if (prodResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      product: prodResult.recordset[0],
      reviews: reviewsResult.recordset
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// Add review (VULNERABILITY: Stored XSS)
router.post('/:id/reviews', async (req, res) => {
  const productId = req.params.id;
  const { userId, comment, rating } = req.body;

  try {
    const pool = await getPool();
    const query = `INSERT INTO Reviews (ProductId, UserId, Comment, Rating) VALUES (${productId}, ${userId || 1}, '${comment}', ${rating || 5})`;
    await pool.request().query(query);

    res.json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database insert error', details: err.message });
  }
});

// Reflected XSS Preview Endpoint (CWE-79 Dynamic Verification Probe)
router.get('/preview/echo', (req, res) => {
  const query = req.query.q || req.query.search || '';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html><html><body><div id="search-preview"><h1>Search Preview</h1><p>Query: ${query}</p></div></body></html>`);
});

module.exports = router;
