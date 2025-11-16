const express = require('express');
const path = require('path');
const middleware = require('./middleware');
const productAPI = require('./api/products');

const server = express();
server.use(express.static(path.resolve(__dirname, 'public')));
server.use(middleware.cors);
server.use(express.json());
server.use('/api/prints', productAPI.router);
server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
server.use(middleware.notFound);
server.use(middleware.errorHandler);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Main server running on ${PORT}`));
