const fs = require("fs").promises;
const path = require("path");
const express = require("express");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));

// ----------------------
// ROOT
// ----------------------
app.get("/", handleRoot);

// ----------------------
// GET ALL PRODUCTS (with filter + pagination)
// ----------------------
app.get("/products", listProducts);

// ----------------------
// GET SINGLE PRODUCT
// ----------------------
app.get("/products/:id", getProduct);

// ----------------------
// CREATE PRODUCT
// ----------------------
app.post("/products", createProduct);

// ----------------------
// UPDATE PRODUCT
// ----------------------
app.put("/products/:id", updateProduct);

// ----------------------
// DELETE PRODUCT
// ----------------------
app.delete("/products/:id", deleteProduct);

// ----------------------
// START SERVER
// ----------------------
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// ======================
// FUNCTIONS
// ======================

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
}

// ----------------------
// LIST PRODUCTS
// ----------------------
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, "data/products.json");

  try {
    const data = await fs.readFile(productsFile);
    let products = JSON.parse(data);

    let { page = 1, limit = 10, name } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // FILTER
    if (name) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // PAGINATION
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json(products.slice(start, end));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------
// GET PRODUCT
// ----------------------
async function getProduct(req, res) {
  const productsFile = path.join(__dirname, "data/products.json");

  try {
    const data = await fs.readFile(productsFile);
    const products = JSON.parse(data);

    const product = products.find(p => p.id == req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
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
  const productsFile = path.join(__dirname, "data/products.json");

  try {
    const data = await fs.readFile(productsFile);
    let products = JSON.parse(data);

    const newProduct = {
      id: products.length + 1,
      ...req.body
    };

    products.push(newProduct);

    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------
// UPDATE PRODUCT
// ----------------------
async function updateProduct(req, res) {
  const productsFile = path.join(__dirname, "data/products.json");

  try {
    const data = await fs.readFile(productsFile);
    let products = JSON.parse(data);

    const index = products.findIndex(p => p.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    products[index] = {
      ...products[index],
      ...req.body
    };

    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------
// DELETE PRODUCT
// ----------------------
async function deleteProduct(req, res) {
  const productsFile = path.join(__dirname, "data/products.json");

  try {
    const data = await fs.readFile(productsFile);
    let products = JSON.parse(data);

    const newProducts = products.filter(p => p.id != req.params.id);

    await fs.writeFile(productsFile, JSON.stringify(newProducts, null, 2));

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
