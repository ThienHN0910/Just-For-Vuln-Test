const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

// VULNERABILITY 3: IDOR - View user profile by ID without checking authorization context
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const pool = await poolPromise;
    // Direct Object Reference without validating if requester is owner or admin
    const result = await pool.request().query(`SELECT Id, Username, FullName, Email, Bio, Role, Avatar FROM Users WHERE Id = ${userId}`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VULNERABILITY 3: IDOR & Stored XSS - Update user profile by ID without authorization check
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { fullName, email, bio, avatar } = req.body;

  try {
    const pool = await poolPromise;
    // Does NOT verify if logged-in user matches req.params.id
    const query = `
      UPDATE Users 
      SET FullName = '${fullName}', Email = '${email}', Bio = '${bio}', Avatar = '${avatar}'
      WHERE Id = ${userId}
    `;
    console.log('[DEBUG Update User Query]:', query);

    await pool.request().query(query);

    res.json({ message: 'Profile updated successfully', userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
