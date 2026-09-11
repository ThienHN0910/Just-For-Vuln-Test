const mssql = require('mssql');
const path = require('path');
const { getFallbackDb, createFallbackPool } = require('./fallback-db');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433', 10),
  connectionTimeout: 5000, // Quick timeout for fast fallback if unreachable
  requestTimeout: 15000,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true
  }
};

let globalPool = null;

async function getPool() {
  if (globalPool && (globalPool.connected || globalPool.isFallback)) {
    return globalPool;
  }

  // 1. Try Remote MSSQL Connection if credentials are configured
  if (config.user && config.password && config.server && config.database) {
    try {
      console.log(`Connecting to remote MSSQL server: ${config.server}...`);
      const pool = await mssql.connect(config);
      console.log('✅ Connected to Remote MSSQL Database successfully.');
      globalPool = pool;
      return globalPool;
    } catch (err) {
      console.warn(`⚠️ Remote MSSQL Connection Failed (${err.message}). Activating In-Memory Fallback Database...`);
    }
  } else {
    console.warn('⚠️ MSSQL Environment Variables not set. Activating In-Memory Fallback Database...');
  }

  // 2. Fallback to Embedded In-Memory Database (Zero-Downtime Fallback)
  try {
    const fallbackDb = await getFallbackDb();
    globalPool = createFallbackPool(fallbackDb);
    globalPool.isFallback = true;
    console.log('✅ Connected to Embedded Fallback Database successfully.');
    return globalPool;
  } catch (fallbackErr) {
    console.error('❌ Fallback DB Initialization Failed:', fallbackErr.message);
    throw fallbackErr;
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
