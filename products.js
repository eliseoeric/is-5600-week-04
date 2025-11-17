const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

module.exports = { list, get, create, update, remove };

/**
 * List products with pagination + optional tag filter.
 * Returns an ARRAY (frontend expects prints.map(...)).
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;
  const all = JSON.parse(await fs.readFile(productsFile, 'utf-8'));

  const filtered = tag
    ? all.filter(p => {
        // Many datasets store tags either as array of strings/objects or a string
        if (Array.isArray(p.tags)) {
          // if tags are objects with {title}, use titles
          const titles = p.tags.map(t => (typeof t === 'string' ? t : t?.title)).filter(Boolean);
          return titles.includes(tag);
        }
        if (typeof p.tags === 'string') return p.tags.split(',').map(s => s.trim()).includes(tag);
        return false;
      })
    : all;

  return filtered.slice(offset, offset + limit);
}

/** Get one product by id */
async function get(id) {
  const all = JSON.parse(await fs.readFile(productsFile, 'utf-8'));
  return all.find(p => p.id === id) || null;
}

/** Create – stub for lab */
async function create(body) {
  console.log('[CREATE] product payload:', body);
  return { 
    ...body, 
    id: body?.id || `tmp_${Date.now()}` 
  };
}


/** Update – stub for lab */
async function update(id, body) {
  console.log('[UPDATE] id:', id, 'payload:', body);
  return { id, ...body };
}

/** Delete – stub for lab */
async function remove(id) {
  console.log('[DELETE] id:', id);
  return true;
}