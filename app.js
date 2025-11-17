// app.js

const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');

const app = express();

// Middleware
app.use(middleware.cors);        // Enable CORS if needed
app.use(bodyParser.json());      // Parse JSON request bodies
app.use(express.static(__dirname + '/public')); // Serve static files

// Routes
app.get('/', api.handleRoot);           // Root route
app.get('/products', api.listProducts); // List products route

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
