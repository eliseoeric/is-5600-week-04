// lib/auto-catch.js

/**
 * Wraps all async route handlers so errors go to Express error handler
 */
module.exports = function autoCatch(handlers) {
  const wrapped = {}

  for (const key of Object.keys(handlers)) {
    wrapped[key] = function (req, res, next) {
      return Promise.resolve(handlers[key](req, res, next)).catch(next)
    }
  }

  return wrapped
}
