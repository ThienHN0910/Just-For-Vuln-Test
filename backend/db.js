const mssql = require('mssql');
require('dotenv').config({ path: '../.env' });

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Password123!',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'VulnShopDB',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: false, // Set to true if using Azure
    trustServerCertificate: true
  }
};

const poolPromise = new mssql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL Database successfully.');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
  });

module.exports = {
  mssql,
  poolPromise
};
