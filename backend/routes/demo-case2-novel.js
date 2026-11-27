const express = require('express');
const router = express.Router();

// Case 2: Novel CWE-79 reflected XSS pattern not yet stored in MongoDB verified_remediation_cache
router.get('/preview', (req, res) => {
  const supplier = req.query.supplier || '';
  const previewHtml = `<!DOCTYPE html><html><body><section class="supplier-preview"><h1>Supplier Preview</h1><p>Partner: ${supplier}</p></section></body></html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(previewHtml);
});

module.exports = router;
