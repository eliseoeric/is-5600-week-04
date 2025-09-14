const port = process.env.PORT || 3000
// Boot the app
const app = express()
app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin
  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept')
  next()
})

app.use(express.static(__dirname + '/public'))
app.get('/products', listProducts)

app.get('/', handleRoot)

// ADD: POST route
app.post('/products', createProduct)

// ADD: PUT route
app.put('/products/:id', updateProduct)

// ADD: DELETE route
app.delete('/products/:id', deleteProduct)

// 404 middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'Internal Error Occurred' })
})

app.listen(port, () => console.log(`Server listening on port ${port}`))

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts (req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
function createProduct (req, res) {
  console.log('CREATE product with:', req.body)
  res.status(201).json({ message: 'Product created', product: req.body })
}

/**
 * Update a product (stub)
 */
function updateProduct (req, res) {
  const { id } = req.params
  console.log(`UPDATE product ${id} with:`, req.body)
  res.status(200).json({ message: `Product ${id} updated`, product: req.body })
}

/**
 * Delete a product (stub)
 */
function deleteProduct (req, res) {
  const { id } = req.params
  console.log(`DELETE product ${id}`)
  res.status(202).json({ message: `Product ${id} deleted` })
}