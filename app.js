const fs = require('fs').promises
const path = require('path')
const express = require('express')
const api=require('./api')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.get('/',api.handleRoot)
app.get('/products', api.listProducts)

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))

