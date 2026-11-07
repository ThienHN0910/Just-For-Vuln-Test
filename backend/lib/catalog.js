// Retest fixture for ACVIS #454: helpers whose sinks sit one import away from the route.
async function findByName(pool, name) {
  const sql = "SELECT * FROM Products WHERE Name LIKE '%" + name + "%'";
  return pool.request().query(sql);
}

async function findById(pool, id) {
  const safeId = id;
  return pool.request().query('SELECT * FROM Products WHERE Id = ' + safeId);
}

module.exports = { findByName, findById };
