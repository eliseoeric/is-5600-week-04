const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const productsRouter = require('./routes/products');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/products', productsRouter);

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
