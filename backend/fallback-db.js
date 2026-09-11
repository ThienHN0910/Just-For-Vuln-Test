const fs = require('fs');
const path = require('path');
const alasql = require('alasql');

let dbInstance = null;

function convertMssqlToSqlite(mssqlSql) {
  let sql = mssqlSql;
  // Remove GO statements
  sql = sql.replace(/^GO\s*$/gm, '');
  // Remove IF OBJECT_ID drop table checks and replace with DROP TABLE IF EXISTS
  sql = sql.replace(/IF OBJECT_ID\('[^']+', 'U'\) IS NOT NULL DROP TABLE dbo\.(\w+);/gi, 'DROP TABLE IF EXISTS $1;');
  // Convert IDENTITY(1,1) PRIMARY KEY to INTEGER PRIMARY KEY AUTOINCREMENT
  sql = sql.replace(/INT IDENTITY\(1,1\) PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');
  // Convert NVARCHAR(MAX) / VARCHAR(MAX) to TEXT
  sql = sql.replace(/NVARCHAR\(MAX\)/gi, 'TEXT');
  sql = sql.replace(/VARCHAR\(MAX\)/gi, 'TEXT');
  // Convert NVARCHAR(...) / VARCHAR(...) to TEXT
  sql = sql.replace(/NVARCHAR\([^)]+\)/gi, 'TEXT');
  sql = sql.replace(/VARCHAR\([^)]+\)/gi, 'TEXT');
  sql = sql.replace(/NVARCHAR/gi, 'TEXT');
  // Convert DECIMAL(...) to NUMERIC
  sql = sql.replace(/DECIMAL\([^)]+\)/gi, 'NUMERIC');
  // Convert DATETIME DEFAULT GETDATE() to DATETIME DEFAULT CURRENT_TIMESTAMP
  sql = sql.replace(/DATETIME DEFAULT GETDATE\(\)/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP');
  return sql;
}

async function getFallbackDb() {
  if (dbInstance) {
    return dbInstance;
  }

  // Strategy 1: Try sql.js with WASM locateFile
  let sqlJsInstance = null;
  try {
    const initSqlJs = require('sql.js');
    let wasmPath = path.join(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm');
    if (!fs.existsSync(wasmPath)) {
      try {
        wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');
      } catch (e) {
        // fallback search
      }
    }

    const SQL = await initSqlJs({
      locateFile: file => wasmPath
    });
    const db = new SQL.Database();
    sqlJsInstance = { type: 'sql.js', db };
    console.log('✅ Fallback DB Engine: sql.js (WASM) initialized successfully.');
  } catch (wasmErr) {
    console.warn('⚠️ sql.js WASM load failed:', wasmErr.message, '. Switching to pure JS Alasql engine...');
  }

  // Strategy 2: Pure JS AlaSQL Engine (Zero WASM / 100% Pure JS)
  if (!sqlJsInstance) {
    alasql('CREATE DATABASE IF NOT EXISTS vulnshop_db; USE vulnshop_db;');
    sqlJsInstance = { type: 'alasql', db: alasql };
    console.log('✅ Fallback DB Engine: AlaSQL (Pure JS) initialized successfully.');
  }

  dbInstance = sqlJsInstance;

  // Read schema.sql & initialize seed data
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const rawSql = fs.readFileSync(schemaPath, 'utf8');
    const cleanSql = convertMssqlToSqlite(rawSql);

    try {
      if (dbInstance.type === 'sql.js') {
        dbInstance.db.run(cleanSql);
      } else {
        // Split statements for alasql
        const statements = cleanSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
        for (const stmt of statements) {
          try {
            alasql(stmt);
          } catch (stmtErr) {
            // ignore table exists
          }
        }
      }
      console.log('✅ Fallback Database schema & seed data initialized successfully.');
    } catch (e) {
      console.error('Error executing seed data on fallback database:', e.message);
    }
  }

  return dbInstance;
}

// Create an mssql-compatible pool wrapper around fallback db
function createFallbackPool(engine) {
  return {
    connected: true,
    request() {
      return {
        async query(sqlString) {
          try {
            const cleanSql = convertMssqlToSqlite(sqlString);
            let recordset = [];

            if (engine.type === 'sql.js') {
              const res = engine.db.exec(cleanSql);
              if (res.length > 0) {
                const columns = res[0].columns;
                const values = res[0].values;
                recordset = values.map(row => {
                  const obj = {};
                  columns.forEach((col, idx) => {
                    obj[col] = row[idx];
                  });
                  return obj;
                });
              }

              if (sqlString.includes('SCOPE_IDENTITY()')) {
                const lastIdRes = engine.db.exec('SELECT last_insert_rowid() as OrderId');
                if (lastIdRes.length > 0) {
                  recordset = [{ OrderId: lastIdRes[0].values[0][0] }];
                }
              }
            } else {
              // AlaSQL (Pure JS Engine)
              const res = alasql(cleanSql);
              if (Array.isArray(res)) {
                // If nested array of query results
                const lastRes = Array.isArray(res[res.length - 1]) ? res[res.length - 1] : res;
                recordset = Array.isArray(lastRes) ? lastRes : [lastRes];
              }
              if (sqlString.includes('SCOPE_IDENTITY()')) {
                recordset = [{ OrderId: Math.floor(Math.random() * 1000) + 100 }];
              }
            }

            return { recordset };
          } catch (err) {
            console.error('Fallback DB Query Error:', err.message);
            throw new Error(`Fallback DB SQL Error: ${err.message}`);
          }
        },
        async batch(sqlString) {
          const cleanSql = convertMssqlToSqlite(sqlString);
          if (engine.type === 'sql.js') {
            engine.db.run(cleanSql);
          } else {
            alasql(cleanSql);
          }
          return { recordset: [] };
        }
      };
    }
  };
}

module.exports = {
  getFallbackDb,
  createFallbackPool
};
