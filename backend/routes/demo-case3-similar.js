const express = require('express');
const router = express.Router();

// Case 3: CWE-79 reflected XSS structurally similar to Case 2 for MongoDB vector search reuse
router.get('/preview', (req, res) => {
  const vendor = req.query.vendor || '';
  const previewHtml = `<!DOCTYPE html><html><body><section class="vendor-preview"><h1>Vendor Preview</h1><p>Partner: ${vendor}</p></section></body></html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(previewHtml);
});

module.exports = router;
