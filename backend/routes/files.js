const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Download product attachments, manuals, and documents (CWE-22: Path Traversal)
router.get('/download', (req, res) => {
  const fileName = req.query.file;

  if (!fileName) {
    return res.status(400).send('File parameter is required');
  }

  // VULNERABILITY: Direct path.join without directory boundary validation allows path traversal
  const uploadDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadDir, fileName);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.status(404).send(`File not found at: ${filePath}`);
});

// Health check and connectivity test for remote asset storage or backup server (CWE-78: Command Injection)
router.get('/storage/ping', (req, res) => {
  const host = req.query.host || '127.0.0.1';

  // VULNERABILITY: exec executes system command with unvalidated user input
  exec(`ping -n 1 ${host}`, (err, stdout) => {
    res.type('text/plain').send(stdout || err?.message || 'Storage server reachable');
  });
});

module.exports = router;
