const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Support desk: list a customer's open tickets
router.get('/tickets', async (req, res) => {
  const customer = req.query.customer;

  try {
    const pool = await getPool();
    const ticketSql = `SELECT TicketID, Subject, Status FROM Tickets WHERE CustomerEmail = '${customer}' AND Status = 'open'`;
    const tickets = await pool.request().query(ticketSql);
    res.json({ tickets: tickets.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Ticket lookup failed' });
  }
});

module.exports = router;
