const Products = require('./products');

// Route to serve the index page
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
}

// List all products
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  try {
    const products = await Products.list({ offset, limit, tag });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a single product
async function getProduct(req, res, next) {
  const { id } = req.params;
  try {
    const product = await Products.get(id);
    if (!product) {
      return next();
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new product
async function createProduct(req, res) {
  console.log('Creating product:', req.body);
  res.json(req.body);  // Placeholder response, you will implement product creation logic here
}

// Update a product
async function updateProduct(req, res) {
  console.log('Updating product:', req.params.id);
  res.status(200).json({ message: 'Product updated' });
}

// Delete a product
async function deleteProduct(req, res) {
  console.log('Deleting product:', req.params.id);
  res.status(202).json({ message: 'Product deleted' });
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
