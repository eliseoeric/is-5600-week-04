const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // load .env variables

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Sample route
app.get('/', (req, res) => {
  res.send('Ecommerce API is working!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
