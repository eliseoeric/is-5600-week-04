const express = require("express");
const app = express();

app.use(express.json());

// dummy data
let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
  { id: 3, name: "Headphones", price: 200 }
];

// GET all products
app.get("/products", (req, res) => {
  let { page = 1, limit = 10, name } = req.query;

  let filtered = [...products];

  if (name) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  const start = (page - 1) * limit;
  const end = start + Number(limit);

  res.json(filtered.slice(start, end));
});

// GET single product
app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

// CREATE product
app.post("/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE product
app.put("/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.json({ message: "Deleted successfully" });
});

// ⚠️ IMPORTANT: use dynamic port (prevents your error)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});