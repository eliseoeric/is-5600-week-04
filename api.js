const path = require('path');
const fs = require('fs').promises;

const productsPath = path.join(__dirname, 'data/full-products.json');

async function loadProducts() {
  const data = await fs.readFile(productsPath, 'utf8');
  return JSON.parse(data);
}

// GET /
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

// GET /products?offset=&limit=&tag=
async function listProducts(req, res, next) {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const tag = req.query.tag || '';

    let products = await loadProducts();

    // Tag filter
    if (tag) {
      products = products.filter(p =>
        p.tags.some(t => t.title.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    const paginated = products.slice(offset, offset + limit);
    res.json(paginated);

  } catch (err) {
    next(err);
  }
}

// Not required but included for structure
function getProduct(req, res) {
  res.json({ message: "Not required for lab" });
}

function createProduct(req, res) {
  res.json({ message: "Not required for lab" });
}

// REQUIRED BY LAB – PUT
function updateProduct(req, res) {
  console.log("Updated product:", req.params.id, req.body);
  res.status(200).json({ message: "Product updated" });
}

// REQUIRED BY LAB – DELETE
function deleteProduct(req, res) {
  console.log("Deleted product:", req.params.id);
  res.status(202).json({ message: "Product deleted" });
}

module.exports = {
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
