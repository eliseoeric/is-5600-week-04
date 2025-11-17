// products.js
const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data', 'full-products.json');

module.exports = {
  list,
  get,
  create,
  update,
  remove
};

// GET list with pagination + optional tag filter
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const data = JSON.parse(await fs.readFile(productsFile, 'utf8'));

  let arr = data;
  if (tag) {
    const t = String(tag).toLowerCase();
    arr = arr.filter(p =>
      Array.isArray(p.tags) ? p.tags.some(x => String(x).toLowerCase() === t) : false
    );
  }

  // NOTE: lab doesn’t require total-count wrapper; return slice directly
  return arr.slice(offset, offset + limit);
}

// GET one
async function get(id) {
  const data = JSON.parse(await fs.readFile(productsFile, 'utf8'));
  return data.find(p => p.id === id) || null;
}

// POST (placeholder) — echo back with an id if missing
async function create(body) {
  console.log('CREATE product (placeholder):', body);
  return { id: body.id || `tmp_${Date.now()}`, ...body };
}

// PUT (placeholder)
async function update(id, body) {
  console.log(`UPDATE product ${id} (placeholder):`, body);
  return { id, ...body };
}

// DELETE (placeholder)
async function remove(id) {
  console.log(`DELETE product ${id} (placeholder)`);
  return true;
}
