const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { poolPromise } = require('../db');

// Endpoint to trigger DB schema migration & seed data
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).json({ error: 'Database pool connection failed' });
    }

    const sqlPath = path.join(__dirname, '../schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    await pool.request().batch(sqlContent);

    return res.json({
      message: '✅ Database seed & migration completed successfully on remote database!'
    });
  } catch (err) {
    console.error('Init DB Error:', err);
    return res.status(500).json({
      error: 'Migration execution failed',
      details: err.message
    });
  }
});

module.exports = router;
