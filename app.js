// app.js
const express = require('express');
const app = express();
const productsRouter = require('./routes/products');
const logger = require('./middleware/logger');
const validateProduct = require('./middleware/validateProduct');

// Built-in middleware
app.use(express.json());

// Custom middleware
app.use(logger);

// Routes
// For create & update, attach validation on appropriate routes:
app.use('/products', (req, res, next) => {
  // apply validateProduct only for POST and full PUT (optional)
  if ((req.method === 'POST' || req.method === 'PUT') && (req.path === '/' || /^\/\d+/.test(req.path))) {
    // we will call validate logic inside routes or mount here
  }
  next();
});
app.use('/products', productsRouter);

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
