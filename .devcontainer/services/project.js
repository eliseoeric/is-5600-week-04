const fs = require('fs').promises;
const path = require('path');
const productsPath = path.join(__dirname, '../data/full-products.json');

async function list(req, res, next) {
  try {
    let products = JSON.parse(await fs.readFile(productsPath));
    if (req.query.tag) {
      products = products.filter(p => p.tags.includes(req.query.tag));
    }
    const offset = Number(req.query.offset || 0);
    const limit = Number(req.query.limit || 25);
    return res.json({ products: products.slice(offset, offset + limit), total: products.length });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const products = JSON.parse(await fs.readFile(productsPath));
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  res.status(201).json({ message: 'Create endpoint reached', data: req.body });
}

function update(req, res, next) {
  res.json({ message: `Update product with id ${req.params.id}`, data: req.body });
}

function remove(req, res, next) {
  res.status(202).json({ message: `Delete product with id ${req.params.id}` });
}

module.exports = { list, getById, create, update, remove };
