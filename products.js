const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

async function list(options = {}) {
    const { offset = 0, limit = 25, tag } = options;

    const data = await fs.readFile(productsFile);

    return JSON.parse(data)
        .filter(product => !tag || product.tags.some(({ title }) => title === tag))
        .slice(offset, offset + limit);
}

async function get(id) {
    const products = JSON.parse(await fs.readFile(productsFile)); // Fixed JSON parsing

    return products.find(product => product.id === id) || null;
}

module.exports = {
    list,
    get, // Added missing export
};
