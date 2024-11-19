const fs = require('fs').promises
const path = require('path') 

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {

    const { offset = 0, limit = 25,tag } = options

    const data = await fs.readFile(productsFile)
  
    return JSON.parse(data)
    .filter(products=> ){
        if(!tag){
            return product
        }

        return product.tags.find(({title})=>title == tag)
    }
    .slice(offset, offset + limit)


    async function get (id) {
        const products = await JSON.parse(await fs.readFile(productsFile))
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
              return products[i]
            }
        }
        return null;
    } 


module.exports = {
    list,
get
  }
  // Method to "delete" a product
const deleteProduct = (req, res) => {
    const { id } = req.params;
    console.log(`Product with ID ${id} deleted.`);
    res.status(202).send({ message: `Product with ID ${id} has been deleted.` });
};

// Method to "update" a product
const updateProduct = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    console.log(`Product with ID ${id} updated with data:`, updatedData);
    res.status(200).send({ message: `Product with ID ${id} has been updated.` });
};

module.exports = {
    deleteProduct,
    updateProduct,
    // Other methods...
};
