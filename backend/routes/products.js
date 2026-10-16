const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Get all products or search (VULNERABILITY: SQL Injection stacked query support)
router.get('/', async (req, res) => {
  const search = req.query.search || '';
  const category = req.query.category || '';

  try {
    const pool = await getPool();
    let query = `SELECT * FROM Products`;
    if (category) {
      // INTENTIONAL SQL INJECTION (CWE-89): Boolean differential & time-based delay verification
      query = `SELECT * FROM Products WHERE Category = '${category}'`;
    } else if (search) {
      // INTENTIONAL SQL INJECTION (CWE-89): Stacked query & string concatenation verification
      query = `SELECT * FROM Products WHERE Name LIKE '%${search}%' OR Description LIKE '%${search}%'`;
    }
    console.log('[DEBUG Product Query]:', query);

    const result = await pool.request().query(query);

    // If query returns multiple recordsets (stacked query injection like SELECT * FROM Users),
    // send back all recordsets raw so security testers can inspect extracted data!
    if (result.recordsets && result.recordsets.length > 1) {
      return res.json({
        searchTerm: search,
        products: result.recordsets[0],
        rawRecordsets: result.recordsets, // Extra leaked stacked query results!
        rawResult: result
      });
    }

    res.json({
      searchTerm: search,
      products: result.recordset || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message, queryExecuted: req.query.search });
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

// Reflected XSS Preview Endpoint
router.get('/preview/echo', (req, res) => {
  const q = req.query.q || req.query.search || '';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html><html><body><div id="search-preview"><h1>Search Preview</h1><p>Query: ${q}</p></div></body></html>`);
});

module.exports = router;
