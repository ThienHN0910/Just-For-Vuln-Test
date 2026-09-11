const mssql = require('mssql');
const path = require('path');
const { getFallbackDb, createFallbackPool } = require('./fallback-db');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'db67736',
  password: process.env.DB_PASSWORD || 'w#8H!Gd6B4+f',
  server: process.env.DB_SERVER || 'db67736.databaseasp.net',
  database: process.env.DB_NAME || 'db67736',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  connectionTimeout: 5000, // 5s timeout to attempt direct connection
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

  // 1. Try Direct Remote MSSQL Connection
  try {
    console.log(`Connecting to MSSQL server: ${config.server}, database: ${config.database}...`);
    const pool = await mssql.connect(config);
    console.log('✅ Connected to Remote MSSQL Database successfully.');
    globalPool = pool;
    return globalPool;
  } catch (err) {
    console.warn(`⚠️ Remote MSSQL Connection Failed (${err.message} [${err.code || 'ESOCKET'}]). MonsterASP MSSQL allows local datacenter connections only. Activating In-Memory Fallback Database for external request...`);
  }

  // 2. Seamless In-Memory Database Fallback for External Requests (e.g. Vercel)
  try {
    const fallbackDb = await getFallbackDb();
    globalPool = createFallbackPool(fallbackDb);
    globalPool.isFallback = true;
    console.log('✅ Connected to In-Memory Fallback Database successfully.');
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
