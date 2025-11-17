module.exports = function autoCatch (handlers) {
  return Object.keys(handlers).reduce((autoHandlers, key) => {
    const handler = handlers[key]
    autoHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next)
    return autoHandlers
  }, {})
}
// lib/auto-catch.js

/**
 * Wrap all functions in an object so async errors are forwarded to next()
 * Usage: module.exports = autoCatch({ fn1, fn2, ... })
 */
function autoCatch (obj) {
  const wrapped = {}

  for (const key of Object.keys(obj)) {
    const fn = obj[key]
    if (typeof fn !== 'function') {
      wrapped[key] = fn
      continue
    }

    // create wrapper
    wrapped[key] = function (req, res, next) {
      // call original function and catch any rejected promises
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  }

  return wrapped
}

module.exports = autoCatch

