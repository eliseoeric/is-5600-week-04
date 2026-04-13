const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data', 'full-products.json');

// READ all products
async function getAllProducts() {
    const data = await fs.readFile(productsFile, 'utf-8');
    return JSON.parse(data);
}

module.exports = {
    getAllProducts
};