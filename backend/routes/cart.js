const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

// Get cart for a user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT c.Id as CartId, c.Quantity, p.* 
      FROM Cart c 
      JOIN Products p ON c.ProductId = p.Id 
      WHERE c.UserId = ${userId}
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request().query(`
      INSERT INTO Cart (UserId, ProductId, Quantity) 
      VALUES (${userId}, ${productId}, ${quantity || 1})
    `);
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
