// app.js
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');

const app = express();
// Use middleware
app.use(middleware.cors);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// Define routes
app.get('/', api.handleRoot); 
app.get('/products', api.listProducts); 
app.get('/products/:id', api.getProduct); 
app.post('/products', api.createProduct); 
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);
app.use(middleware.handleError);
app.use(middleware.handleError);
// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});