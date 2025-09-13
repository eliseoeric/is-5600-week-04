const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const api = require('./api');
const middleware = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// global middleware
app.use(middleware.cors);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', api.rootHandler);
app.get('/products', api.fetchProducts);
app.get('/products/:id', api.fetchProductById);
app.post('/products', api.addProduct);
app.put('/products/:id', api.modifyProduct);
app.delete('/products/:id', api.removeProduct);

// error middleware
app.use(middleware.notFound);
app.use(middleware.errorHandler);

app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
});
