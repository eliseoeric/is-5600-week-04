const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const middleware = require('./middleware');
const path = require('path');  // Add this line

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));  // Ensure to use path here
app.use(middleware.cors);
app.use(bodyParser.json());

app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.post('/products', api.createProduct);
app.put('/products/:id', api.updateProduct);
app.delete('/products/:id', api.deleteProduct);

app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(port, () => console.log(`Server listening on port ${port}`));