const fs = require("fs").promises;
const path = require("path");

const file = path.join(__dirname, "full-products.json");

// normalize tags array
function normalizeTags(tags) {
  return Array.isArray(tags)
    ? tags.map(t => (typeof t === "string" ? t : t.title || "misc"))
    : [];
}

// list with pagination + tag filter
async function list({ limit = 5, offset = 0, tag }) {
  const raw = await fs.readFile(file, "utf8");
  let products = JSON.parse(raw);

  if (tag) {
    products = products.filter(p => normalizeTags(p.tags).includes(tag));
  }

  return products.slice(offset, offset + limit);
}

// find one by id
async function find(id) {
  const raw = await fs.readFile(file, "utf8");
  const products = JSON.parse(raw);
  return products.find(p => p.id === id) || null;
}

module.exports = { list, find };
