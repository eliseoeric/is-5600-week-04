// lib/auto-catch.js

/**
 * Wraps an object of async functions, adding automatic error catching and passing 
 * the error to the Express 'next' function.
 * @param {object} handlers - An object where keys are route names and values are Express async route handlers (req, res, next).
 * @returns {object} - A new object with wrapped handlers.
 */
module.exports = function autoCatch (handlers) {
  const proxy = {}
  
  for (const key in handlers) {
    // Check if the property is a function
    if (typeof handlers[key] === 'function') {
      proxy[key] = catchWrapper(handlers[key])
    } else {
      proxy[key] = handlers[key]
    }
  }
  
  return proxy
}

/**
 * Wraps an async Express handler function with a try/catch block.
 * @param {function} handler - The async (req, res, next) => {} function.
 * @returns {function} - The wrapped function.
 */
function catchWrapper (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (err) {
      // Pass the error to Express's error handling middleware
      next(err) 
    }
  }
}