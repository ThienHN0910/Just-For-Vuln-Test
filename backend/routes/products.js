const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Get all products or search (VULNERABILITY: SQL Injection & Reflected XSS)
router.get('/', async (req, res) => {
  const search = req.query.search || '';

  try {
    const pool = await getPool();
    let query = `SELECT * FROM Products`;
    if (search) {
      // RAW CONCATENATION - SQL INJECTION
      query += ` WHERE Name LIKE '%${search}%' OR Description LIKE '%${search}%'`;
    }
    console.log('[DEBUG Product Query]:', query);

    const result = await pool.request().query(query);

    res.json({
      searchTerm: search, // Reflected XSS when rendered in frontend
      products: result.recordset
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
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

module.exports = router;
