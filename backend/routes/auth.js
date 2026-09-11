const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getPool } = require('../db');

const HARDCODED_JWT_SECRET = 'hardcoded_vulnerable_secret_123';
const JWT_SECRET = process.env.JWT_SECRET || HARDCODED_JWT_SECRET;

// SQL Injection in Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await getPool();

    // RAW UNEXCAPED SQL QUERY - INTENTIONAL SQL INJECTION
    const query = `SELECT * FROM Users WHERE Username = '${username}' AND Password = '${password}'`;
    console.log('[DEBUG SQL Query]:', query);

    const result = await pool.request().query(query);

    if (result.recordset && result.recordset.length > 0) {
      const user = result.recordset[0];
      const token = jwt.sign(
        { id: user.Id, username: user.Username, role: user.Role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.Id,
          username: user.Username,
          fullName: user.FullName,
          email: user.Email,
          role: user.Role
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login error', details: err.message });
  }
});

module.exports = router;
