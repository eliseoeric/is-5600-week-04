# Lab 04 | Fullstack Prints Part 1

## Table of Contents

1. [Lab 04 | Fullstack Prints Part 1](#lab-04--Fullstack Prints Part 1)
   - [Overview](#overview)
   - [Instructions](#instructions)
2. [Guidance and Testing](#guidance-and-testing)
3. [Submission](#submission)
4. [Getting Started with GitHub and Codespaces](#getting-started-with-github-and-codespaces)
   - [Step 1: Fork the Repository](#step-1-fork-the-repository)
   - [Step 2: Open the Repository in Codespaces](#step-2-open-the-repository-in-codespaces)
   - [Step 3: Complete the Lab Assignment](#step-3-complete-the-lab-assignment)
   - [Step 4: Submit Your Work via Pull Request](#step-4-submit-your-work-via-pull-request)


## Overview

In this lab, we will be building a simple eCommerce server. We will be using Node.js and Express to build our server. We will use this as the basis for our future labs. This eCommerce server will be pretty basic. It will:

- provide a list of all products
- allow for filtering and pagination of products
- allow for the creation of new products
- allow for users to view a single product
- allow for users to update a single product
- allow for users to delete a single product

The frontend will be provided for you during this lab. We will focus 100% on building the backend component of this application. During the lab you will also learn about middleware and build and register a few simple middleware functions.

## Instructions

1. To begin, you should see the `app.js` file. This file already has a basic server that does the following:

- Sets up the server to listen on port 3000
- Registers the `/products` route with the `listProducts` route handler
- Configures the `listProducts` route handler to read, and return the data in the `data/full-products.json` file
- Configures the `public` directory for our node server to listen for static files

2. Next you'll see our `public/index.html` file. This file will fetch our products from the `/products` endpoint and quickly renders them to the page. We won't go in too much detail
over what is happening there, but you can review the code if you are curious.

3. Before we go too further in the lab, let's modularize and clean up our codebase. An important part of web development is abstraction. Typically, the less code you have to review at a given time, the less cognitive load you have to deal with. This is why we want to abstract our code into modules. This also makes refactoring easier and allows us to reuse code. For our server, we want to pull all of our route handlers into their own file. This will allow us to keep our `app.js` file clean and easy to read. Begin by creating a new file called `api.js` and moving all of our route handlers there:

```js
// api.js
const path = require('path')

 /**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  // Read the products file
  const productsFile = path.join(__dirname, 'data/full-products.json')
  
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  handleRoot,
  listProducts
}
```

And let's update our `app.js` to have the modified route handlers:

```js
// app.js
// Add the api module
const api = require('./api')

// update the route handlers
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
```

4. Next, let's modularize the products as well. Let's create a service module that will handle all of our products interaction. Create a new file called `products.js`

```js
// products.js
const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

module.exports = {
  list
}


/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list () {
  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
}
```

And let's update our `api.js` to reflect these changes.

```js
// api.js
const Products = require('./products')

// ...

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  try {
    res.json(await Products.list()) // Use the Products service
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
```

Great - refactoring is done! Review your app in the browser. If everything looks good, let's move on to the next step.

5. At the moment, our server always returns the same data set, and only returns all of the data at once. Typically, a webserver allows for filtering or pagination of data. Let's configure our server to allow for two optional queries: `limit` and `offset`. These queries will allow us to limit the number of products returned, and the offset of the products returned. For example, if we had 100 products, and we wanted to return the first 10 products, we would use the following query: `?limit=10&offset=0`. If we wanted to return the next 10 products, we would use the following query: `?limit=10&offset=10`. Let's update our `api.js` to handle these queries:

We will update our `listProducts` method to extract the `limit` and `offset` query parameters from the request. We will then pass these parameters to the `Products.list` method. We will also update the `Products.list` method to accept these parameters and use them to filter the products. Finally, we will update the `Products.list` method to return an object that contains the products and the total number of products. This will allow us to return the total number of products to the client, which will allow us to implement pagination in the future.

```js
// api.js

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {

  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25 } = req.query

  try {
    // Pass the limit and offset to the Products service
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit)
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
```

Now let's update our `list` method in the `products.js` file.
  
```js
// products.js

/**
 * List all products
 * @returns {Promise<Array>}
 */
async function list (options = {}) {
  const { offset = 0, limit = 25 } = options
  const data = await fs.readFile(productsFile)

  return JSON.parse(data).slice(offset, offset + limit) // Slice the products
}
```

Review this in the browser, you should be able to visit `/products?limit=1&offset=20` and see a filtered subset of products. If everything looks good, let's move on to the next step.

6. Modern web APIs typically allow for filtering of data as well. Let's add a `tag` query parameter to our endpoint, so we can filter out specific products. For example, if we wanted to filter out all products that have the tag `electronics`, we would use the following query: `?tag=electronics`. On your own, update the `api.js` and `products.js` files to handle this query parameter. You can use the `limit` and `offset` query parameters as a reference. You should use `Array.filter` in the `Products.list()` method to filter the products based on the tag.

7. Next, let's add the ability to fetch a single product. The route should look something like `/products/oZPSX_mQ3xI`. First let's add the route to the `app.js` file. We will use the `:id` parameter to capture the product id. We will then pass this parameter to the `api.getProduct` method.

```js
// app.js

// ...

app.get('/products/:id', api.getProduct)
```

Now, let's add the `getProduct()` method to our `api.js` module:
  
```js
// api.js

// update the module exports
module.exports = {
  handleRoot,
  listProducts,
  getProduct
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { id } = req.params

  try {
    const product = await Products.get(id)
    if (!product) {
      // next() is a callback that will pass the request to the next available route in the stack
      return next()
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
```

Finally, we need to add the `Products.get()` method to the `products.js` module.

```js
// products.js

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
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
```

Don't forget to update the `module.exports` object in the `products.js` file to include the `get` method.

8. At the moment we have a functioning API server, but there is some cleaning up to do. If we examine the `api` module methods, you'll see a lot of repeated code. Specifically, we are setting the CORS headers and handling errors in each method. Let's refactor the `api` module to use a middleware function to handle these tasks. First, let's create a new `middleware.js` file in the `api` directory. We will add a `cors` middleware function to this file. This function will set the CORS headers on the response object. We will then add this middleware function to the `app.js` file.

```js
// app.js
// Require the middleware module
const middleware = require('middleware')

// Register our upcoming middleware
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
```

```js
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
```

Now we can remove the response headers from our `api.listProducts` and `api.getProduct` methods.

9. You'll notice that we are still using the same try/catch to handle the errors in our `api` module. Let's refactor this to use a middleware function. First, let's create a new `error` method in our `middleware` module. We will add a `handleError` middleware function to this file. This function will handle any errors that are thrown in the request/response cycle. We will then add this middleware function to the `app.js` file.

```js
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

```

Lastly - let's implement our `auto-catch` feature. In your lab you'll see a `lib/auto-catch.js` file. This function will help us clean up the try/catches we have in our api routes. We can use this function to wrap our async functions and it will automatically catch any errors that are thrown. Let's add this to our `api.js` file.

```js
// api.js
const autoCatch = require('lib/auto-catch')

// Update the module exports
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct
});

// Remove the try/catch from the api methods

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts (req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  
  return res.json(product)
}
```

10. Our final task will be to add the ability to create or update new products. This will use the HTTP POST method. We will begin by creating a new route for the POST method in the `app.js` file.

```js
// app.js
// Add body parser middleware
const bodyParser = require('body-parser')

// ...
app.use(middleware.cors)
app.use(bodyParser.json())

//...
app.post('/products', api.createProduct)
```

Then update your `api.js` file to include a `createProduct` method.

```js
// api.js
/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}
```

This is just a placeholder for now. We will update this method to create a new product in the next step. You can test this by taking the Codespace app URL, and using Postman to send a POST request to the `/products` endpoint. You should see the request body in the console.

Great! Now we almost have a working application. Please proceed to the next section to complete the final steps on your own.

## Your Task

To complete this lab you will need to add the following features:

1. Add a DELETE route to the `app.js` module and register a delete method with the `products.js` module. This task will require you to create a new method in the `products.js` module and route similar to the `products.createProduct` method. The method body does not need to _truly_ delete the product. It can simply return a 202 response and log a message to the server console that the product was deleted.

2. Add a PUT route to the `app.js` module that will be used to update a product. This task will require you to create a new method in the `products.js` module and route similar to the `products.createProduct` method. The method body does not need to _truly_ update the product. It can simply return a 200 response and log a message to the server console that the product was updated.

## Guidance and Testing

1. Install postman
1. The steps above should walk you through creating the layout to match the mockup. You can review the video walkthrough for further guidance.

## Submission

Once you have completed the lab, please submit your lab by committing the code and creating a pull request against the `main` branch of your forked repository.

Once you have a URL for your Pull Request, submit that URL with a brief message in Canvas against the Assignment. 

# Getting Started with GitHub and Codespaces

Welcome to the course! In this guide, you’ll learn how to set up your coding environment using GitHub and Codespaces. By following these steps, you’ll be able to work on your lab assignments, write and test your code, and submit your work for review. Let's get started!

## Step 1: Fork the Repository

Forking a repository means making a copy of it under your GitHub account. This allows you to make changes without affecting the original project.

1. **Open the Repository**: Start by navigating to the GitHub repository link provided by your instructor.
2. **Click "Fork"**: In the top-right corner, find the “Fork” button and click it.
3. **Select Your Account**: Choose your GitHub account as the destination for the fork. Once done, you’ll be redirected to your forked copy of the repository.
   
   > **Tip**: Make sure you’re logged into your GitHub account, or you won’t see the option to fork!

## Step 2: Open the Repository in Codespaces

With your forked repository ready, you can now set up a development environment using Codespaces. This setup provides a pre-configured environment for you to code in, with everything you need to complete the lab.

1. **Open the Codespaces Menu**:
   - In your forked repository, click the green "Code" button, then switch to the "Codespaces" tab.
2. **Create a Codespace**:
   - Click on "Create codespace on main" to start the setup.
3. **Wait for Codespaces to Load**:
   - It may take a few minutes for Codespaces to create and configure your environment. Be patient, as it’s setting up all the tools you’ll need.
4. **Start Coding**:
   - Once the setup is complete, Codespaces will automatically open a new browser tab where your code will be ready to run. You’ll be able to see the code and any outputs as you go through the lab assignment.

## Step 3: Complete the Lab Assignment

Inside the Codespaces environment, you’ll find all the files and instructions you need. Follow the steps outlined in the README file to complete your assignment.

1. **Read the Instructions**: Carefully go through the README file to understand the tasks you need to complete.
2. **Edit the Code**: Make the necessary changes to the code files as instructed.
3. **Run and Test Your Code**: Use the terminal and editor within Codespaces to run your code and make sure everything works as expected.

   > **Hint**: If you’re stuck, try reviewing the README file again or refer to any resources provided by your instructor.

## Step 4: Submit Your Work via Pull Request

Once you’ve completed the assignment, it’s time to submit your work. You’ll do this by creating a pull request, which is a way to propose your changes to the original repository.

1. **Commit Your Changes**:
   - Save your work by committing your changes. In Codespaces, go to the Source Control panel, write a commit message, and click "Commit" to save your changes.
2. **Push to Your Fork**:
   - After committing, click "Push" to upload your changes to your forked repository on GitHub.
3. **Create a Pull Request**:
   - Go back to your GitHub repository, and you’ll see an option to “Compare & pull request.” Click it to start your pull request.
   - Include your name in the pull request description so your instructor knows who submitted it.
4. **Submit the Pull Request**:
   - Click "Create pull request" to submit your work for review. Your instructor will be notified and can review your work.

And that’s it! You’ve now completed your first lab assignment using GitHub and Codespaces. Well done!


### Additional Steps

1. Open the terminal in Codespaces.
2. Run the following commands to install dependencies and start the development server:
    ```sh
    npm install
    npm run dev
    ```
3. You can now view the project in the browser by clicking the "Application" port in the Ports panel.

Follow the instructions in the previous sections to complete the lab.
