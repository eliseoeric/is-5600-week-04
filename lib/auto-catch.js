module.exports = function autoCatch (handlers) {
  return Object.keys(handlers).reduce((autoHandlers, key) => {
    const handler = handlers[key]
    autoHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next)
    return autoHandlers
  }, {})
}

module.exports = function autoCatch(handlers) {
  const keys = Object.keys(handlers)
  return keys.reduce((acc, key) => {
    const handler = handlers[key]
    acc[key] = (req, res, next) => {
      Promise.resolve(handler(req, res, next)).catch(next)
    }
    return acc
  }, {})
}
