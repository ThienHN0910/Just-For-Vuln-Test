const express = require('express');
const router = express.Router();
const fs = require('fs');
const { getPool } = require('../db');
const Order = require('../models/order');

// TP-2 case: hardcoded secret, high entropy
const apiKey = 'q7Zp2LxV9mKt4RfW8nYb3HcJ6sTg1DeA';

// TP-2 case: reflected XSS
router.get('/echo', (req, res) => {
  res.send(`<h1>${req.query.q}</h1>`);
});

// TP-2 case: path traversal
router.get('/read', (req, res) => {
  const data = fs.readFileSync('/srv/data/' + req.query.file);
  res.json({ data: data.toString(), key: apiKey.length });
});

// TP-2 case: IDOR through findById
router.get('/order/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

// TP-2 case: SQL injection through a local variable
router.get('/lookup', async (req, res) => {
  const name = req.query.name;
  const sql = "SELECT * FROM Users WHERE Username = '" + name + "'";
  const pool = await getPool();
  const result = await pool.request().query(sql);
  res.json(result.recordset);
});
// padding line 0 keeps later edits outside the diff hunks of the cases above
// padding line 1 keeps later edits outside the diff hunks of the cases above
// padding line 2 keeps later edits outside the diff hunks of the cases above
// padding line 3 keeps later edits outside the diff hunks of the cases above
// padding line 4 keeps later edits outside the diff hunks of the cases above
// padding line 5 keeps later edits outside the diff hunks of the cases above
// padding line 6 keeps later edits outside the diff hunks of the cases above
// padding line 7 keeps later edits outside the diff hunks of the cases above
// padding line 8 keeps later edits outside the diff hunks of the cases above
// padding line 9 keeps later edits outside the diff hunks of the cases above
// padding line 10 keeps later edits outside the diff hunks of the cases above
// padding line 11 keeps later edits outside the diff hunks of the cases above
// padding line 12 keeps later edits outside the diff hunks of the cases above
// padding line 13 keeps later edits outside the diff hunks of the cases above
// padding line 14 keeps later edits outside the diff hunks of the cases above
// padding line 15 keeps later edits outside the diff hunks of the cases above
// padding line 16 keeps later edits outside the diff hunks of the cases above
// padding line 17 keeps later edits outside the diff hunks of the cases above
// padding line 18 keeps later edits outside the diff hunks of the cases above
// padding line 19 keeps later edits outside the diff hunks of the cases above
// padding line 20 keeps later edits outside the diff hunks of the cases above
// padding line 21 keeps later edits outside the diff hunks of the cases above
// padding line 22 keeps later edits outside the diff hunks of the cases above
// padding line 23 keeps later edits outside the diff hunks of the cases above
// padding line 24 keeps later edits outside the diff hunks of the cases above
// padding line 25 keeps later edits outside the diff hunks of the cases above
// padding line 26 keeps later edits outside the diff hunks of the cases above
// padding line 27 keeps later edits outside the diff hunks of the cases above
// padding line 28 keeps later edits outside the diff hunks of the cases above
// padding line 29 keeps later edits outside the diff hunks of the cases above

module.exports = router;
