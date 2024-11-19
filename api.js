const path = require('path');
const Products = require('./products');


function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}


async function listProducts(req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25 } = req.query || {};

  try {
    // Pass the limit and offset to the Products service
    const products = await Products.list({
      offset: Number(offset),
      limit: Number(limit),
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleRoot,
  listProducts,
};
