const Products = require('./products');
const path = require('path');

// Home page
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

// GET all products (with pagination + filtering)
async function listProducts(req, res) {
    const { limit = 10, offset = 0, tag } = req.query;

    let products = await Products.getAllProducts();

    if (tag) {
        products = products.filter(p =>
            p.tags && p.tags.includes(tag)
        );
    }

    const result = products.slice(
        parseInt(offset),
        parseInt(offset) + parseInt(limit)
    );

    res.json(result);
}

// GET single product
async function getProduct(req, res) {
    const products = await Products.getAllProducts();

    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
}

// CREATE product
async function createProduct(req, res) {
    const products = await Products.getAllProducts();

    const newProduct = req.body;
    newProduct.id = products.length + 1;

    products.push(newProduct);

    res.status(201).json(newProduct);
}

// UPDATE product
async function updateProduct(req, res) {
    const products = await Products.getAllProducts();

    const index = products.findIndex(p => p.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products[index] = {
        ...products[index],
        ...req.body
    };

    res.json(products[index]);
}

// DELETE product
async function deleteProduct(req, res) {
    const products = await Products.getAllProducts();

    const filtered = products.filter(p => p.id != req.params.id);

    res.json({ message: "Product deleted" });
}

// Export
module.exports = {
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};