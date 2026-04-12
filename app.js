const fs = require("fs").promises;
const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Routes
app.get("/", handleRoot);
app.get("/products", listProducts);
app.get("/products/:id", getProduct);
app.post("/products", createProduct);
app.put("/products/:id", updateProduct);
app.delete("/products/:id", deleteProduct);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// ----------------------
// ROOT
// ----------------------
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

// ----------------------
// GET ALL PRODUCTS (filter + pagination)
// ----------------------
async function listProducts(req, res) {
  const file = path.join(__dirname, "data/products.json");

  try {
    let data = await fs.readFile(file);
    let products = JSON.parse(data);

    let { page = 1, limit = 10, name } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // Filter
    if (name) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json(products.slice(start, end));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------
// GET SINGLE PRODUCT
// ----------------------
async function getProduct(req, res) {
  const file = path.join(__dirname, "data/products.json");

  try {
    let data = await fs.readFile(file);
    let products = JSON.parse(data);

    const product = products.find(p => p.id == req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------
// CREATE PRODUCT
// ----------------------
async function createProduct(req, res) {
  const file = path.join(__dirname, "data/products.json");

  try {
    let data = await fs.readFile(file);
    let products = JSON.parse(data);

    const newProduct = {
      id: products.length + 1,
      ...req.body
    };

    products.push(newProduct);

    await fs.writeFile(file, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------
// UPDATE PRODUCT
// ----------------------
async function updateProduct(req, res) {
  const file = path.join(__dirname, "data/products.json");

  try {
    let data = await fs.readFile(file);
    let products = JSON.parse(data);

    const index = products.findIndex(p => p.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    products[index] = {
      ...products[index],
      ...req.body
    };

    await fs.writeFile(file, JSON.stringify(products, null, 2));

    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------
// DELETE PRODUCT
// ----------------------
async function deleteProduct(req, res) {
  const file = path.join(__dirname, "data/products.json");

  try {
    let data = await fs.readFile(file);
    let products = JSON.parse(data);

    const newProducts = products.filter(p => p.id != req.params.id);

    await fs.writeFile(file, JSON.stringify(newProducts, null, 2));

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
