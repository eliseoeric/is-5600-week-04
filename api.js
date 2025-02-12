const Orders = require('./models/orders'); // Adjust the path as needed

// Root handler
function handleRoot(req, res) {
  res.send('Welcome to the API!');
}

// Product handlers
function listProducts(req, res) {
  res.json({ message: 'List of products' });
}

function getProduct(req, res) {
  const { id } = req.params;
  res.json({ message: `Product with ID ${id}` });
}

function createProduct(req, res) {
  const product = req.body;
  res.json({ message: 'Product created', product });
}

function updateProduct(req, res) {
  const { id } = req.params;
  const product = req.body;
  res.json({ message: `Product with ID ${id} updated`, product });
}

function deleteProduct(req, res) {
  const { id } = req.params;
  res.json({ message: `Product with ID ${id} deleted` });
}

// Order handlers
async function createOrder(req, res) {
  const order = await Orders.create(req.body);
  res.json(order);
}

async function listOrders(req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query;

  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status,
  });

  res.json(orders);
}

async function editOrder(req, res) {
  const { id } = req.params;
  const order = await Orders.update(id, req.body);
  res.json(order);
}

async function deleteOrder(req, res) {
  const { id } = req.params;
  await Orders.delete(id);
  res.json({ message: `Order with ID ${id} deleted` });
}

// Export all functions
module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  listOrders,
  editOrder,
  deleteOrder,
};