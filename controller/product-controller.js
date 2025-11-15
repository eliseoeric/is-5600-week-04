const products = require("../data/products.json");

exports.getAllProducts = (req, res) => {
  let result = [...products];

  // Filtering
  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }

  // Pagination
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    page,
    limit,
    total: result.length,
    data: result.slice(start, end)
  });
};

exports.getProductById = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).json({ message: "Not found" });
};

exports.createProduct = (req, res) => {
  const newProduct = { id: products.length + 1, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Not found" });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
};

exports.deleteProduct = (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Not found" });

  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
};
