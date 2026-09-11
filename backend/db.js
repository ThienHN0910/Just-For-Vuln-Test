const mssql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433', 10),
  connectionTimeout: 15000,
  requestTimeout: 30000,
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
    if (!config.user || !config.password || !config.server || !config.database) {
      throw new Error(`Missing database environment variables (DB_USER, DB_PASSWORD, DB_SERVER, DB_NAME). Please configure them in Vercel Dashboard.`);
    }

    if (globalPool) {
      try {
        await globalPool.close();
      } catch (e) {
        // ignore close error
      }
    }

    globalPool = await mssql.connect(config);
    console.log('Connected to MSSQL Database successfully.');
    return globalPool;
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    globalPool = null;
    throw err;
  }
}

// Fallback promise for backward compatibility
const poolPromise = getPool().catch(err => {
  console.error('Initial pool connection failed:', err.message);
  return null;
});

module.exports = {
  mssql,
  getPool,
  poolPromise
};
