const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

// VULNERABILITY 3: IDOR - Get order by ID without checking if order belongs to authenticated user
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    const pool = await poolPromise;
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
    res.status(500).json({ error: err.message });
  }
});

// Checkout cart to create order
router.post('/checkout', async (req, res) => {
  const { userId, totalAmount } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      INSERT INTO Orders (UserId, TotalAmount, Status) 
      VALUES (${userId}, ${totalAmount}, 'Completed');
      SELECT SCOPE_IDENTITY() as OrderId;
    `);

    const orderId = result.recordset[0].OrderId;
    // Clear user cart
    await pool.request().query(`DELETE FROM Cart WHERE UserId = ${userId}`);

    res.json({ message: 'Order created successfully', orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
