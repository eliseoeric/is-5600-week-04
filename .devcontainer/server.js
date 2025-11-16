const express = require('express');
const path = require('path');
const { productsRouter } = require('./routes/products');
const { rootHandler } = require('./routes/root');
const middleware = require('./middleware');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(middleware.cors);
app.use(express.json());

app.use('/products', productsRouter);
app.get('/', rootHandler);

app.use(middleware.notFound);
app.use(middleware.handleError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lab 4 server running on ${PORT}`);
});
