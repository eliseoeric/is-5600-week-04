// app.js
const express = require('express');
const app = express();
const productsRouter = require('./data/routes/products');

const logger = require('./data/middleware/logger');

// Built-in middleware
app.use(express.json());

// Custom logger middleware
app.use(logger);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the eCommerce API! Use /products to see products.');
});

// Products routes
app.use('/products', productsRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
