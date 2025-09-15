// app.js
const express = require('express');
const api = require('./api');
const middleware = require('./middleware');

const PORT = Number(process.env.PORT) || 3000;

const app = express();

// Core middleware
app.use(middleware.cors);
app.use(express.json()); // replaces body-parser.json()

// Static files
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);

// 404 then error handler (order matters)
app.use(middleware.notFound);
app.use(middleware.handleError);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// Helpful errors (e.g., port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Pick another port:`);
    console.error(`   ▶ Try: PORT=${PORT + 1} npm start`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown: frees the port on Ctrl+C / container stop
const shutdown = (sig) => {
  console.log(`\n${sig} received. Shutting down...`);
  server.close(() => {
    console.log('✅ Server closed. Bye!');
    process.exit(0);
  });
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
