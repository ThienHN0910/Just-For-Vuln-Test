const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getPool } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Login endpoint (SECURE: Parameterized Query)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await getPool();

    // SECURE PARAMETERIZED QUERY
    const result = await pool.request()
      .input('username', username)
      .input('password', password)
      .query('SELECT * FROM Users WHERE Username = @username AND Password = @password');

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
