const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getPool } = require('../db');

async function handleInitDb(req, res) {
  try {
    const pool = await getPool();
    const sqlPath = path.join(__dirname, '../schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    await pool.request().batch(sqlContent);

    return res.json({
      status: 'success',
      message: '✅ Database seed & migration completed successfully!'
    });
  } catch (err) {
    console.error('Init DB Error:', err);
    return res.status(500).json({
      status: 'error',
      error: 'Migration execution failed',
      details: err.message
    });
  }
}

// Support both GET and POST requests for /api/init-db
router.get('/', handleInitDb);
router.post('/', handleInitDb);

module.exports = router;
