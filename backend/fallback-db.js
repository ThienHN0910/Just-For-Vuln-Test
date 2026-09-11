const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

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

  const SQL = await initSqlJs();
  dbInstance = new SQL.Database();

  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const rawSql = fs.readFileSync(schemaPath, 'utf8');
    const sqliteSql = convertMssqlToSqlite(rawSql);
    try {
      dbInstance.run(sqliteSql);
      console.log('✅ In-Memory Fallback Database initialized with seed data.');
    } catch (e) {
      console.error('Error initializing fallback database schema:', e.message);
    }
  }

  return dbInstance;
}

// Create an mssql-compatible pool wrapper around fallback db
function createFallbackPool(db) {
  return {
    connected: true,
    request() {
      return {
        async query(sqlString) {
          try {
            const cleanSql = convertMssqlToSqlite(sqlString);
            
            // Execute query
            const res = db.exec(cleanSql);

            let recordset = [];
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

            // Handle SCOPE_IDENTITY() for order checkout
            if (sqlString.includes('SCOPE_IDENTITY()')) {
              const lastIdRes = db.exec('SELECT last_insert_rowid() as OrderId');
              if (lastIdRes.length > 0) {
                recordset = [{ OrderId: lastIdRes[0].values[0][0] }];
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
          db.run(cleanSql);
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
