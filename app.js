const fs = require('fs').promises;
const path = require('path');
const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', handleRoot);
app.get('/products', listProducts);
app.get('/products/:id', getSingleProduct);
app.post('/products', createProduct);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);

app.listen(port, () => console.log(`Server listening on port ${port}`));

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

async function readProducts() {
  const filePath = path.join(__dirname, 'data', 'full-products.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeProducts(products) {
  const filePath = path.join(__dirname, 'data', 'full-products.json');
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
}

function findProductIndex(products, idParam) {
  const cleanedId = String(idParam).trim();

  // exact id match first
  let index = products.findIndex(
    product => String(product.id).trim() === cleanedId
  );

  if (index !== -1) {
    return index;
  }

  // fallback: numeric position, so /products/1 returns first item
  const numericId = Number(cleanedId);
  if (!Number.isNaN(numericId) && numericId >= 1 && numericId <= products.length) {
    return numericId - 1;
  }

  return -1;
}

async function listProducts(req, res) {
  try {
    let products = await readProducts();

    const search = req.query.name || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || products.length;

    if (search) {
      products = products.filter(product =>
        JSON.stringify(product).toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    res.json(products.slice(start, end));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getSingleProduct(req, res) {
  try {
    const products = await readProducts();
    const index = findProductIndex(products, req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const products = await readProducts();

    const newProduct = {
      id: Date.now().toString(),
      ...req.body
    };

    products.push(newProduct);
    await writeProducts(products);

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const products = await readProducts();
    const index = findProductIndex(products, req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      ...req.body,
      id: products[index].id
    };

    await writeProducts(products);
    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const products = await readProducts();
    const index = findProductIndex(products, req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products[index];
    products.splice(index, 1);

    await writeProducts(products);

    res.json({
      message: 'Deleted successfully',
      product: deletedProduct
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}