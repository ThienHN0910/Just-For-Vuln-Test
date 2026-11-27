const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Case 3: CWE-22 Path Traversal with high semantic similarity (>= 0.90) to Case 2 (demo-case2-novel.js)
// Distinct variable names avoid trivial exact_hash match so ACVIS proves 768d vector search reuse
// Expected ACVIS behavior: hits Case 2's newly saved MongoDB record -> reuses patch with 0 LLM calls
// Endpoint: GET /api/vendors/contract?doc=
router.get('/contract', (req, res) => {
  const doc = req.query.doc;

  if (!doc) {
    return res.status(400).json({ error: 'Vendor document name is required' });
  }

  try {
    const vendorContractPath = path.join(__dirname, '../uploads', doc);
    const fileContent = fs.readFileSync(vendorContractPath, 'utf8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(fileContent);
  } catch (err) {
    res.status(404).json({ error: 'Vendor contract not found' });
  }
});

module.exports = router;
