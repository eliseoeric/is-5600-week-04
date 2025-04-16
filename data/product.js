const fs = require('fs').promises
const path = require('path')


const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {
    const { offset = 0, limit = 25, tag } = options
    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter(product => {
        if (!tag) {
            return product
        }

        return product.tags.find( ( { title } ) =>  title == tag)
    })
    .slice(offset, offset + limit)
  }

async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))


    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        return products[i]
      }
    }

    return null;
  }


  const products = {
    deleteProduct: (req, res) => {
        const productId = req.params.id;
        console.log(`Product with ID ${productId} was requested for deletion.`);
        res.status(202).json({ message: `Product ${productId} deleted (simulated)` });
    },
    updateProduct: (req, res) => {
        const productId = req.params.id;
        const updatedProductData = req.body;
        console.log(`Product with ID ${productId} was requested for update. Data:`, updatedProductData);
        res.status(200).json({ message: `Product ${productId} updated (simulated)`, updatedProductData });
    },
    list,  // Add list and get to the products object
    get     // Add list and get to the products object
};

module.exports = products;