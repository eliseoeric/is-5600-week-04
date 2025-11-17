const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dbPath = path.join(__dirname, "products.json");

function loadProducts() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveProducts(products) {
  fs.writeFileSync(dbPath, JSON.stringify(products, null, 2));
}

app.get("/products", (req, res) => {
  let { offset = 0, limit = 10, category, minPrice, maxPrice } = req.query;

  offset = Number(offset);
  limit = Number(limit);

  let products = loadProducts();

  if (category && category.trim() !== "") {
    products = products.filter(p =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (minPrice !== undefined && minPrice !== "" && !isNaN(minPrice)) {
    products = products.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== "" && !isNaN(maxPrice)) {
    products = products.filter(p => p.price <= Number(maxPrice));
  }

  const paginated = products.slice(offset, offset + limit);

  res.json({
    total: products.length,
    offset,
    limit,
    data: paginated
  });
});

app.get("/products/:id", (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

app.post("/products", (req, res) => {
  const products = loadProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  let products = loadProducts();
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });

  products[index] = { ...products[index], ...req.body };
  saveProducts(products);

  res.json(products[index]);
});

app.delete("/products/:id", (req, res) => {
  let products = loadProducts();
  const filtered = products.filter(p => p.id != req.params.id);

  if (filtered.length === products.length)
    return res.status(404).json({ error: "Not found" });

  saveProducts(filtered);

  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/", express.static(__dirname));

app.listen(port, () => console.log("Server running on port " + port));
