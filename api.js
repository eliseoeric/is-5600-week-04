const fs = require('fs').promises
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

// Serve the root HTML page
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

// List all products with optional filtering and pagination
async function listProducts(req, res) {
    const { offset = 0, limit = 25, tag } = req.query;
    try {
        res.json(await Products.list({
            offset: Number(offset),
            limit: Number(limit),
            tag,
        }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Retrieve a single product by ID
async function getProduct(req, res, next) {
    const { id } = req.params;
    try {
        const product = await Products.get(id);
        if (!product) {
            return next();
        }
        return res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Create a new product (mock implementation)
async function createProduct(req, res) {
    console.log('request body:', req.body);
    res.json(req.body);
}

// Delete a product by ID
async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        console.log(`DELETE request received for product ID: ${id}`);
        await Products.delete(id); // Simulated deletion
        res.status(202).json({ message: `Product with ID ${id} deleted.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update a product by ID
async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        console.log(`PUT request received for product ID: ${id}`);
        console.log('Updated data:', updatedData);
        await Products.update(id, updatedData); // Simulated update
        res.status(200).json({ message: `Product with ID ${id} updated.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
});
