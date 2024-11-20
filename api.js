
const path = require('path');
const fs = require('fs/promises');
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
async function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
// async function listProducts(req, res) {
//     const productsFile = path.join(__dirname, 'data/full-products.json')
//     try {
//         const data = await fs.readFile(productsFile)
//         res.json(JSON.parse(data))
//     } catch (err) {
//         res.status(500).json({ error: err.message })
//     }
// }


async function listProducts(req, res) {

    const { offset = 0, limit = 25, tag } = req.query
    console.log(offset, limit)
    res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag
    }))
}

async function getProduct(req, res, next) {
    const { id } = req.params

    const product = await Products.get(id)
    if (!product) {
        return next()
    }

    return res.json(product)
}



async function createProduct(req, res) {
    console.log('request body:', req.body)
    res.json(req.body)
}

async function deleteProduct(req, res) {
    const productId = req.params.id;
    console.log(`Product with ID ${productId} deleted`);
    res.status(202).json({ message: `Product with ID ${productId} deleted` });
}
function updateProduct(req, res) {
    const productId = req.params.id;
    const { title } = req.body;
    console.log(`Product with ID ${productId} updated to title: ${title}`);
    res.status(200).json({ message: `Product with ID ${productId} updated to title: ${title}` });
}



module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
});