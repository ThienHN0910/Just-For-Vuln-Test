const mssql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'db67736',
  password: process.env.DB_PASSWORD || 'w#8H!Gd6B4+f',
  server: process.env.DB_SERVER || 'db67736.databaseasp.net',
  database: process.env.DB_NAME || 'db67736',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  connectionTimeout: 30000,
  requestTimeout: 60000,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true
  }
};

let globalPool = null;

async function getPool() {
  if (globalPool && globalPool.connected) {
    return globalPool;
  }

  try {
    console.log(`Connecting to MSSQL server: ${config.server}, database: ${config.database}...`);
    globalPool = await mssql.connect(config);
    console.log('✅ Connected to Remote MSSQL Database successfully.');
    return globalPool;
  } catch (err) {
    console.error('❌ Remote MSSQL Connection Error:', err);
    globalPool = null;
    throw err;
  }
}

const poolPromise = getPool().catch(err => {
  console.error('Initial pool connection failed:', err.message);
  return null;
});

module.exports = {
  mssql,
  getPool,
  poolPromise
};
