const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const { requireOwner } = require('../helpers/auth');

async function loadInvoice(req, res) {
  res.json(await Invoice.findById(req.params.id));
}

router.get('/invoice/:id', loadInvoice);

module.exports = router;
