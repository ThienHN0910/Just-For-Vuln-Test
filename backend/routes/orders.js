const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Get all orders belonging to a specific user
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT o.*, u.Username, u.FullName 
        FROM Orders o 
        JOIN Users u ON o.UserId = u.Id 
        WHERE o.UserId = @userId
        ORDER BY o.CreatedAt DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// Get single order details by ID
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required to view order details' });
  }

  try {
    const pool = await getPool();
    const orderResult = await pool.request()
      .input('orderId', orderId)
      .query(`
        SELECT o.*, u.Username, u.FullName, u.Email 
        FROM Orders o 
        JOIN Users u ON o.UserId = u.Id 
        WHERE o.Id = @orderId
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orderResult.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// Checkout cart to create order
router.post('/checkout', async (req, res) => {
  const { userId, totalAmount } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', userId)
      .input('totalAmount', totalAmount)
      .query(`
        INSERT INTO Orders (UserId, TotalAmount, Status) 
        VALUES (@userId, @totalAmount, 'Completed');
        SELECT SCOPE_IDENTITY() as OrderId;
      `);

    const orderId = result.recordset && result.recordset[0] ? result.recordset[0].OrderId : 1;
    await pool.request()
      .input('userId', userId)
      .query('DELETE FROM Cart WHERE UserId = @userId');

    res.json({ message: 'Order created successfully', orderId });
  } catch (err) {
    res.status(500).json({ error: 'Database checkout error', details: err.message });
  }
});

// Custom order analytics report export (CWE-89: SQL Injection via query concatenation)
router.get('/analytics/report', async (req, res) => {
  const status = req.query.status || 'Completed';
  const sortBy = req.query.sortBy || 'TotalAmount';
  const order = req.query.order || 'DESC';

  try {
    const pool = await getPool();
    // VULNERABILITY: Raw concatenation into dynamic SQL query allows SQL injection
    const query = `SELECT o.Id, o.UserId, u.Username, o.TotalAmount, o.Status, o.CreatedAt FROM Orders o JOIN Users u ON o.UserId = u.Id WHERE o.Status = '${status}' ORDER BY ${sortBy} ${order}`;
    const result = await pool.request().query(query);

    res.json({
      statusFilter: status,
      sortedBy: sortBy,
      order: order,
      records: result.recordset || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

module.exports = router;
