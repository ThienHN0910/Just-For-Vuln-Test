const express = require('express');
const router = express.Router();
const JWT_SECRET = 'acvis-retest-hardcoded-signing-secret-7f3k2p9q';
const { getPool } = require('../db');

router.get('/lookup', async (req, res) => {
  const pool = await getPool();
  const rows = await pool.request().query(`SELECT * FROM Users WHERE Name = '${req.query.name}'`);
  res.json(rows.recordset);
});

router.get('/strict', async (req, res) => {
  const pool = await getPool();
  const rows = await pool.request().query(`SELECT * FROM Users WHERE Email = '${req.query.email}'`);
  res.json(rows.recordset);
});

router.get('/echo', (req, res) => {
  const query = req.query.q || '';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html><html><body><p>Query: ${query}</p></body></html>`);
});

module.exports = router;
