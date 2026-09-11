const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// VULNERABILITY 5: Path Traversal
// Allows downloading files by passing relative paths without validation (e.g. ?file=../../package.json or ?file=../../.env)
router.get('/download', (req, res) => {
  const fileName = req.query.file;

  if (!fileName) {
    return res.status(400).send('File parameter is required');
  }

  // INTENTIONAL PATH TRAVERSAL VULNERABILITY: path.join without path sanitization/normalization validation
  const uploadDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadDir, fileName);

  console.log('[DEBUG Path Traversal] Requested Path:', filePath);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  } else {
    return res.status(404).send(`File not found at: ${filePath}`);
  }
});

module.exports = router;
