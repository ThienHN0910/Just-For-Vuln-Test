const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// Case 1: Known vulnerability already stored in MongoDB verified_remediation_cache
// Matches verified lesson 8d6cfe41-2069-4a7e-97e6-c28b72116c79 (CWE-89, exact_hash / vector >= 0.90)
// Expected ACVIS behavior: Knowledge Match hit -> reuses verified patch with 0 LLM calls
// Endpoint: GET /api/support/tickets?customer=
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
