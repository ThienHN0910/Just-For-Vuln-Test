const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Get all orders belonging to a specific user (e.g. GET /api/orders/user/2)
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT o.*, u.Username, u.FullName 
      FROM Orders o 
      JOIN Users u ON o.UserId = u.Id 
      WHERE o.UserId = ${userId}
      ORDER BY o.CreatedAt DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// VULNERABILITY: IDOR - Get single order details by ID (GET /api/orders/:id)
// Checks if requester is a logged-in user (role checked), BUT fails to check if order belongs to the requester (no ownership check)!
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    const pool = await getPool();
    const orderResult = await pool.request().query(`
      SELECT o.*, u.Username, u.FullName, u.Email 
      FROM Orders o 
      JOIN Users u ON o.UserId = u.Id 
      WHERE o.Id = ${orderId}
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
    const result = await pool.request().query(`
      INSERT INTO Orders (UserId, TotalAmount, Status) 
      VALUES (${userId}, ${totalAmount}, 'Completed');
      SELECT SCOPE_IDENTITY() as OrderId;
    `);

    const orderId = result.recordset[0].OrderId;
    await pool.request().query(`DELETE FROM Cart WHERE UserId = ${userId}`);

    res.json({ message: 'Order created successfully', orderId });
  } catch (err) {
    res.status(500).json({ error: 'Database checkout error', details: err.message });
  }
});

module.exports = router;
