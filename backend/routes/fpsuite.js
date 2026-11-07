const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const { getPool } = require('../db');
const validator = require('validator');
const escapeHtml = require('escape-html');

const SAFE_FILES = { logo: 'logo.png', terms: 'terms.pdf' };

router.get('/fp1', async (req, res) => {
  const pool = await getPool();
  const r = await pool.request().input('id', sql.Int, req.params.id).query('SELECT * FROM Users WHERE Id = @id');
  res.json(r.recordset);
});

router.get('/fp2', async (req, res) => {
  const pool = await getPool();
  const r = await pool.request().query('SELECT COUNT(*) AS total FROM Products');
  res.json(r.recordset);
});

router.get('/fp3', (req, res) => {
  res.send('ok');
});

router.get('/fp4', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'config.json'));
  res.json(JSON.parse(data));
});

router.get('/fp5', (req, res) => {
  res.send(`<p>${validator.escape(req.query.q)}</p>`);
});

router.get('/fp6', (req, res) => {
  res.send(`<p>${escapeHtml(req.query.q)}</p>`);
});

router.get('/fp7', (req, res) => {
  const name = SAFE_FILES[req.query.f];
  if (!name) return res.status(404).end();
  res.sendFile(path.join(__dirname, name));
});

router.get('/fp8', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  const pool = await getPool();
  const r = await pool.request().query(`SELECT * FROM Products WHERE Id = ${id}`);
  res.json(r.recordset);
});

const placeholderToken = 'your-api-key-here';
const exampleHash = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const version = '1.0.0-beta+exp.sha.5114f85';

module.exports = router;
