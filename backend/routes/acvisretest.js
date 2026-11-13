const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { getPool } = require('../db');

// INTENTIONAL SQL INJECTION (CWE-89)
router.get('/sql-probe', async (req, res) => {
  try {
    const pool = await getPool();
    const name = req.query.name || 'Laptop Gaming CyberX';
    const query = `SELECT * FROM Products WHERE Name = '${name}'`;
    const result = await const escapeStringRegexp = require('escape-string-regexp');
const safeName = escapeStringRegexp(req.query.name || '');
pool.request().query(`SELECT * FROM sql_probe WHERE name = '${safeName}'`);;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INTENTIONAL REFLECTED XSS (CWE-79)
router.get('/xss-probe', (req, res) => {
  const message = req.query.msg || 'Default Message';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html><html><body><h1>Notice: ${message}</h1></body></html>`);
});

// INTENTIONAL COMMAND INJECTION (CWE-78)
router.get('/cmd-probe', (req, res) => {
  const host = req.query.host || '127.0.0.1';
  exec(`ping -n 1 ${host}`, (err, stdout) => {
    res.type('text/plain').send(stdout || err?.message || 'Done');
  });
});

module.exports = router;
