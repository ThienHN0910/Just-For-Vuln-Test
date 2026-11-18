const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// SECURE PARAMETERIZED QUERY (Mitigated CWE-89)
router.get('/sql-probe', async (req, res) => {
  try {
    const pool = await getPool();
    const name = req.query.name || 'Laptop Gaming CyberX';
    const result = await pool.request()
      .input('name', name)
      .query('SELECT * FROM Products WHERE Name = @name');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SECURE OUTPUT (Mitigated CWE-79)
router.get('/xss-probe', (req, res) => {
  const message = req.query.msg || 'Default Message';
  res.json({ message });
});

// SECURE PROBE (Mitigated CWE-78)
router.get('/cmd-probe', (req, res) => {
  res.type('text/plain').send('Diagnostic probe running in safe mode');
});

module.exports = router;

