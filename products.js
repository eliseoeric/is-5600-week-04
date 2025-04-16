const fs = require('fs').promises
const path = require('path')
const productsFile = path.join(__dirname, 'data/full-products.json')

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
    const { offset = 0, limit = 25 , tag} = options
    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter(product => {
        if(!tag){
            return product
        }
        return product.tags.find(({ title}) => title == tag)
    })
        .slice(offset, offset + limit) // Slice the products
}

async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))

    // Loop through the products and return the product with the matching id
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }

     // If no product is found, return null
    return null;
}
/**
 * Create a new product
 */
async function create(productData) {
    const products = JSON.parse(await fs.readFile(productsFile));
    const newProduct = { id: String(Date.now()), ...productData };
    products.push(newProduct);
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    return newProduct;
}

/**
 * Delete a product by ID
 */
async function deleteProduct(id) {
    let products = JSON.parse(await fs.readFile(productsFile));
    const filteredProducts = products.filter(product => product.id !== id);

    if (products.length === filteredProducts.length) {
        return { error: "Product not found" };
    }

    await fs.writeFile(productsFile, JSON.stringify(filteredProducts, null, 2));
    return { message: "Product deleted successfully" };
}

/**
 * Update a product by ID
 */
async function update(id, updatedData) {
    let products = JSON.parse(await fs.readFile(productsFile));
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        return { error: "Product not found" };
    }

    products[index] = { ...products[index], ...updatedData };
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    return products[index];
}

module.exports = {
    list,
    get,
    create,
    deleteProduct,
    update
};