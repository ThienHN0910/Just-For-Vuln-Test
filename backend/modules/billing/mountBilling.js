const invoiceRouter = require('./invoiceRouter');

// Billing endpoints live under one prefix so the gateway can rate-limit them together
module.exports = function mountBilling(app) {
  app.use('/api/billing/invoices', invoiceRouter);
};
