const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// View user profile
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', userId)
      .query('SELECT Id, Username, FullName, Email, Bio, Role, Avatar FROM Users WHERE Id = @userId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { fullName, email, bio, avatar } = req.body;

  try {
    const pool = await getPool();
    const query = `
      UPDATE Users 
      SET FullName = @fullName, Email = @email, Bio = @bio, Avatar = @avatar
      WHERE Id = @userId
    `;

    await pool.request()
      .input('userId', userId)
      .input('fullName', fullName || '')
      .input('email', email || '')
      .input('bio', bio || '')
      .input('avatar', avatar || '')
      .query(query);

    res.json({ message: 'Profile updated successfully', userId });
  } catch (err) {
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
});

// Look up a user by email for the support desk
router.get('/lookup/by-email', async (req, res) => {
  const email = req.query.email;

  try {
    const pool = await getPool();
    const sql = `SELECT UserID, Username, Email FROM Users WHERE Email = '${email}'`;
    const result = await pool.request().query(sql);
    res.json({ users: result.recordset || [] });
  } catch (err) {
    res.status(500).json({ error: 'Lookup failed' });
  }
});

module.exports = router;
