const express = require('express');
const router = express.Router();
const { getPool } = require('../../db');

// Look up a customer's invoices for the billing page
router.get('/lookup', async (req, res) => {
  const customer = req.query.customer;

  try {
    const pool = await getPool();
    const sql = `SELECT InvoiceID, Amount, IssuedAt FROM Invoices WHERE CustomerEmail = '${customer}'`;
    const result = await pool.request().query(sql);
    res.json({ invoices: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Invoice lookup failed' });
  }
});

module.exports = router;
