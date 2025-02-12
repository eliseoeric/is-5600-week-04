const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {
    const { offset = 0, limit = 25, tag } = options
    const data = await fs.readFile(productsFile)
    return JSON.parse(data)
    .filter(product => {
        if (tag) {
            return product
        }
    }
    / middleware.js
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
    .slice(offset, offset + limit)
  }