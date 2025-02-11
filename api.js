const path = require('path');
const Products = require('./products');

function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

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

async function createProduct(req, res) {
    console.log('request body:', req.body);
    res.json(req.body);
}

module.exports = {
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
};
