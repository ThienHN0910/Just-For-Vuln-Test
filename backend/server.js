const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config(); // Fallback to current dir .env if exists

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const fileRoutes = require('./routes/files');
const initRoutes = require('./routes/init');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/init-db', initRoutes);
// Feature routes that ship in later commits are mounted only once their file exists,
// so the API keeps starting while they are still in review.
const hasRoute = (file) => fs.existsSync(path.join(__dirname, 'routes', file));
if (hasRoute('demo1-product-search.js')) app.use('/api/storefront', require('./routes/demo1-product-search'));
require('./modules/reports/registerReports')(app);
if (hasRoute('demo3-price-filter.js')) app.use('/api/catalog', require('./routes/demo3-price-filter'));

// 3 Demo Cases for Dataset & Active Learning
if (hasRoute('demo-case1-known.js')) app.use('/api/support', require('./routes/demo-case1-known'));
if (hasRoute('demo-case2-novel.js')) app.use('/api/suppliers', require('./routes/demo-case2-novel'));
if (hasRoute('demo-case3-similar.js')) app.use('/api/vendors', require('./routes/demo-case3-similar'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vulnerable E-Commerce Backend is running' });
});

// ACVIS Staging Verification Endpoint (ADR-0082)
app.get('/.well-known/acvis-verify.txt', (req, res) => {
  res.type('text/plain').send('392d325e8b8889288e08f3bc6430d0eb0704e9f742165e5022fa4c25ff0b5edb');
});

app.get('/', (req, res) => {
  res.json({ message: 'Vulnerable E-Commerce Backend API root. Go to /api/health for status.' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[VULN-SHOP BACKEND] Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
