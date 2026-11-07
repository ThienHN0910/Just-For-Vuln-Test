const express = require('express');
const router = express.Router();
const validator = require('validator');
const { getPool } = require('../db');

router.get('/swap', (req, res) => {
  const raw = req.query.a;
  const safe = validator.escape(req.query.b);
  if (req.query.mode === 'raw') {
    return res.send(`<p>${raw}</p>`);
  }
  return res.send(`<p>${safe}</p>`);
});

router.get('/partial', async (req, res) => {
  const filter = parseInt(req.query.page, 10) + " OR Name = '" + req.query.name + "'";
  const pool = await getPool();
  const r = await pool.request().query(`SELECT * FROM Products WHERE Id = ${filter}`);
  res.json(r.recordset);
});

module.exports = router;
