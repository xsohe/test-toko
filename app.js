const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./config/database');

// Import routes
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const purchaseRoutes = require('./routes/purchases');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/purchases', purchaseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: 'Error',
    message: 'Terjadi kesalahan pada server',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Halaman Tidak Ditemukan',
  });
});

// Initialize database and start server
db.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
