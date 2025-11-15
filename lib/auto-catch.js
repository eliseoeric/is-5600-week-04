module.exports = function autoCatch (handlers) {
  return Object.keys(handlers).reduce((autoHandlers, key) => {
    const handler = handlers[key]
    autoHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next)
    return autoHandlers
  }, {})
}
// lib/auto-catch.js
module.exports = (handlers) => {
  const wrapped = {}
  for (const key of Object.keys(handlers)) {
    const fn = handlers[key]
    wrapped[key] = function (req, res, next) {
      // If handler returns a Promise, catch errors and call next(err)
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  }
  return wrapped
}

