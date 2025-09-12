const Products = require('./products');

// GET: root
function handleRoot(req, res) {
  res.json({ message: 'Welcome to the Products API!' });
}

// GET: list products
async function listProducts(req, res) {
  const products = await Products.list();
  res.json(products);
}

// GET: get product by id
async function getProduct(req, res) {
  const product = await Products.get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
}

async function createProduct(req, res) {
  const product = await Products.create(req.body);
  res.status(201).json(product);
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const updated = await Products.update(id, req.body);
  res.status(200).json(updated);
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  await Products.remove(id);
  res.status(202).json({ message: `Product ${id} deleted` });
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
