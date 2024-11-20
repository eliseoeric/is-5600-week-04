const autoCatch = require('./lib/auto-catch');
const path = require('path');
const Products = require('./products');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
    const { offset = 0, limit = 25, tag } = req.query;

    try {
        const products = await Products.list({ 
            offset: Number(offset), 
            limit: Number(limit), 
            tag 
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Get a single product by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function getProduct(req, res, next) {
    const { id } = req.params;

    try {
        const product = await Products.get(id);
        if (!product) return next(); // Product not found, call next middleware (404 handler)
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
    const productData = req.body;

    try {
        const newProduct = await Products.create(productData);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Delete a product by ID
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
    const { id } = req.params;

    // Log the deletion request
    console.log(`Deleting product with ID: ${id}`);

    try {
        await Products.delete(id);
        res.status(202).json({ message: `Product with ID ${id} has been marked for deletion.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Update a product by ID
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedProduct = req.body;

    // Log the update request
    console.log(`Updating product with ID: ${id}`, updatedProduct);

    try {
        const updated = await Products.update(id, updatedProduct);
        res.status(200).json({ message: `Product with ID ${id} has been updated.`, updatedProduct: updated });
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
