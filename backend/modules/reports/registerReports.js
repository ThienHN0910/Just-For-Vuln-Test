const fs = require('fs');
const path = require('path');

// Reporting endpoints share one prefix so the gateway can rate-limit them together.
module.exports = function registerReports(app) {
  const exportRoute = path.join(__dirname, '../../routes/demo2-report-export.js');
  if (fs.existsSync(exportRoute)) {
    app.use('/api/reports', require('../../routes/demo2-report-export'));
  }
};
