const sql = require('mssql');
const { getPool } = require('../db');
module.exports = async (id) => (await getPool()).request().input('id', sql.Int, id).query('SELECT * FROM Users WHERE Id = @id');
