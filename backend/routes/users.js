const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// IDOR - View user profile
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT Id, Username, FullName, Email, Bio, Role, Avatar FROM Users WHERE Id = ${userId}`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// IDOR & Stored XSS - Update user profile
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { fullName, email, bio, avatar } = req.body;

  try {
    const pool = await getPool();
    const query = `
      UPDATE Users 
      SET FullName = '${fullName}', Email = '${email}', Bio = '${bio}', Avatar = '${avatar}'
      WHERE Id = ${userId}
    `;

    await pool.request().query(query);

    res.json({ message: 'Profile updated successfully', userId });
  } catch (err) {
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
});

module.exports = router;
