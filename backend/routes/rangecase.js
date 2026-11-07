const { getPool } = require('../db');
module.exports = async (req) => (await getPool()).request().query(`SELECT * FROM Users WHERE Email = '${req.query.email}'`);
