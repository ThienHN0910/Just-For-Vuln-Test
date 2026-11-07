const { getPool } = require('../db');

// S16 comment beside the sink
async function searchUsers(term) {
  const pool = await getPool();
  const result = await pool.request().query(`SELECT Id, Username FROM Users WHERE Username LIKE '%${term}%'`);
  return result.recordset;
}

module.exports = { searchUsers };
