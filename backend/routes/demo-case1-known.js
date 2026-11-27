const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Case 1: Lỗ hổng ĐÃ CÓ trong dataset (verified_remediation_cache / Lesson library)
// Trùng khớp bài học: 8d6cfe41-2069-4a7e-97e6-c28b72116c79
// Endpoint đích: GET /api/support/tickets?customer=
router.get('/tickets', async (req, res) => {
  const customer = req.query.customer;

  try {
    const pool = await getPool();
    const ticketSql = `SELECT TicketID, Subject, Status FROM Tickets WHERE CustomerEmail = @customer AND Status = 'open'`;
    const tickets = await pool.request().input('customer', customer).query(ticketSql);
    res.json({ tickets: tickets.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Ticket lookup failed' });
  }
});

module.exports = router;
