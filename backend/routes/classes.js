const express = require('express');
const router = express.Router();
const fs = require('fs');
const { getPool } = require('../db');
const Order = require('../models/order');

router.get('/echo', (req, res) => {
  res.send(`<h1>${req.query.q}</h1>`);
});

router.get('/read', (req, res) => {
  const data = fs.readFileSync('/srv/data/' + req.query.file);
  res.json({ data: data.toString() });
});

router.get('/order/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

router.get('/lookup', async (req, res) => {
  const name = req.query.name;
  const sql = "SELECT * FROM Users WHERE Username = '" + name + "'";
  const pool = await getPool();
  const result = await pool.request().query(sql);
  res.json(result.recordset);
});

module.exports = router;
