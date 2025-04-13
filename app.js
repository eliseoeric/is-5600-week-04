const fs = require('fs').promises
const path = require('path')
const express = require('express')

// Set the port
// Set port and this is 3000 port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
@@ -12,13 +13,11 @@ app.use(express.static(__dirname + '/public'));
app.get('/products', listProducts)
app.get('/', handleRoot);
// Boot the server
// Boot server
app.listen(port, () => console.log(`Server listening on port ${port}`))

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
@@ -22,7 +23,6 @@ app.listen(port, () => console.log(`Server listening on port ${port}`))
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}
/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
