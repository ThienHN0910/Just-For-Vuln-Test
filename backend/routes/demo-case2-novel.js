const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Case 2: Novel vulnerability (CWE-22 Path Traversal) NOT yet in MongoDB verified_remediation_cache
// Expected ACVIS behavior: low/no similarity in cache -> calls LLM/Gemini to generate patch,
// then persists the patch + metadata + 768d vector into MongoDB (static_verified on Custom Patch / Draft PR / Feedback,
// and promoted to global verified + SFT buffer on Post-Patch ExitCode=1 or Admin approval)
// Endpoint: GET /api/suppliers/contract?doc=
router.get('/contract', (req, res) => {
  const doc = req.query.doc;

  if (!doc) {
    return res.status(400).json({ error: 'Document name is required' });
  }

  try {
    const contractPath = path.join(__dirname, '../uploads', doc);
    const content = fs.readFileSync(contractPath, 'utf8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(content);
  } catch (err) {
    res.status(404).json({ error: 'Supplier contract not found' });
  }
});

module.exports = router;
