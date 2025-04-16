const fs = require("fs").promises;
const path = require("path");

const productsFile = path.join(__dirname, "data/full-products.json");

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile);
  return (
    JSON.parse(data)
      //filter
      .filter((product) => {
        //check if tags exists
        if (!tag) {
          return product;
        }

        return product.tags.find(({ title }) => title == tag);
      })
      .slice(offset, offset + limit)
  ); // Slice the products
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile));
  // Use the .find() method to find a product by ID
  const product = products.find((p) => p.id === id);

  return product || null;
}

module.exports = {
  list,
  get,
};
/**
 * List all products
 * @param {object} req
 * @param {object} res
 */