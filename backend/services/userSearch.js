const sql = require('mssql');
const { getPool } = require('../db');

async function searchUsers(term) {
  const pool = await getPool();
  const result = await pool.request()
    .input('term', sql.NVarChar, `%${term}%`)
    .query('SELECT Id, Username FROM Users WHERE Username LIKE @term');
  return result.recordset;
}

module.exports = { searchUsers };
