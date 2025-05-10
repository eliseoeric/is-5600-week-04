const express = require('express')
const app = express()
const api = require('./routes/api')
const middleware = require('./middleware')

// Apply CORS middleware
app.use(middleware.cors)

// Serve static files from the "public" directory
app.use(express.static('public'))

// Parse JSON request bodies
app.use(express.json())

// Mount API routes
app.use('/api', api)

// Global error handler
app.use(middleware.handleError)

module.exports = app
