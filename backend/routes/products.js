const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Get all products or search by keyword (CWE-89: SQL Injection via search query)
router.get('/', async (req, res) => {
  const search = req.query.search;
  const category = req.query.category;

  try {
    const pool = await getPool();
    let query = 'SELECT * FROM Products';

    if (search) {
      // VULNERABILITY: SQL query concatenation allows SQL injection
      query = `SELECT * FROM Products WHERE Name LIKE '%${search}%' OR Description LIKE '%${search}%'`;
    } else if (category) {
      query = `SELECT * FROM Products WHERE Category = '${category}'`;
    }

    const result = await pool.request().query(query);

    res.json({
      searchTerm: search || null,
      products: result.recordset || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// Get single product details & its reviews (SECURE: Parameterized Query)
router.get('/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const pool = await getPool();
    const prodResult = await pool.request()
      .input('id', productId)
      .query('SELECT * FROM Products WHERE Id = @id');
    const reviewsResult = await pool.request()
      .input('id', productId)
      .query('SELECT r.*, u.Username FROM Reviews r JOIN Users u ON r.UserId = u.Id WHERE r.ProductId = @id');

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

// Add review (SECURE: Parameterized Query)
router.post('/:id/reviews', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { userId, comment, rating } = req.body;
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('productId', productId)
      .input('userId', parseInt(userId, 10) || 1)
      .input('comment', String(comment || ''))
      .input('rating', parseInt(rating, 10) || 5)
      .query('INSERT INTO Reviews (ProductId, UserId, Comment, Rating) VALUES (@productId, @userId, @comment, @rating)');

    res.json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database insert error', details: err.message });
  }
});

// Live product search preview banner (CWE-79: Reflected Cross-Site Scripting)
router.get('/preview/echo', (req, res) => {
  const q = req.query.q || req.query.search || '';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // VULNERABILITY: Raw reflection of untrusted user input without sanitization
  res.send(`<!DOCTYPE html><html><body><div id="search-preview"><h1>Search Preview</h1><p>Query: ${q}</p></div></body></html>`);
});
  
router.get('/analytics/rankings', async (req, res) => {
  const allowedSortFields = ['Price', 'Category', 'TotalProducts', 'AvgPrice', 'MaxPrice'];
  const allowedOrders = ['ASC', 'DESC'];

  const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'Price';
  const order = allowedOrders.includes(req.query.order?.toUpperCase()) ? req.query.order.toUpperCase() : 'DESC';

  try {
    const pool = await getPool();
    // Using template literals here is safe because variables are strictly validated against allow-lists
    const query = `SELECT Category, COUNT(*) AS TotalProducts, AVG(Price) AS AvgPrice, MAX(Price) AS MaxPrice FROM Products GROUP BY Category ORDER BY ${sortBy} ${order}`;
    const result = await pool.request().query(query);

    res.json({
      metric: sortBy,
      order: order,
      rankings: result.recordset || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query error' });
  }
});

router.get('/analytics/sales-breakdown', async (req, res) => {
  const period = req.query.period || '30d';
  const metric = req.query.metric || 'Price';
  const sortDirection = req.query.direction === 'ASC' ? 'ASC' : 'DESC';

  const allowedMetrics = ['Price', 'TotalStock', 'AveragePrice', 'TopPrice'];
  if (!allowedMetrics.includes(metric)) {
    return res.status(400).json({ error: 'Invalid metric parameter' });
  }

  try {
    const pool = await getPool();
    const query = `SELECT Category, COUNT(*) AS TotalStock, AVG(Price) AS AveragePrice, MAX(Price) AS TopPrice FROM Products GROUP BY Category ORDER BY ${metric} ${sortDirection}`;
    const result = await pool.request().query(query);

    res.json({
      reportingPeriod: period,
      sortedByMetric: metric,
      direction: sortDirection,
      breakdown: result.recordset || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query error' });
  }
});

module.exports = router;
