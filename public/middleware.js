// middleware.js
/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors (req, res, next) {
  const origin = req.headers.origin

  // Set the CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, XMODIFY')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')

  next()
}
// middleware.js
/**
 * Handle errors
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function handleError (err, req, res, next) {
  // Log the error to our server's console
  console.error(err)
  
  // If the response has already been sent, we can't send another response
  if (res.headersSent) {
    return next(err)
  }

  // Send a 500 error response
  res.status(500).json({ error: "Internal Error Occurred" })
}

/**
 * Send a 404 response if no route is found
 * @param {object} req
 * @param {object} res
 */
function notFound (req, res) {
  res.status(404).json({ error: "Not Found" })
}
// Dummy functions

const getProducts = (req, res) => {
  res.json({ message: "List of products" });
};

const createProduct = (req, res) => {
  console.log("Product created:", req.body);
  res.status(201).json({ message: "Product created successfully" });
};

// New: Update product
const updateProduct = (req, res) => {
  const productId = req.params.id;
  console.log(`Product with ID ${productId} was updated`);
  res.status(200).json({ message: `Product ${productId} updated successfully` });
};

// New: Delete product
const deleteProduct = (req, res) => {
  const productId = req.params.id;
  console.log(`Product with ID ${productId} was deleted`);
  res.status(202).json({ message: `Product ${productId} deleted successfully` });
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
