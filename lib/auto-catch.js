module.exports = function autoCatch (handlers) {
  const wrappedHandlers = {}

  Object.keys(handlers).forEach(key => {
    wrappedHandlers[key] = function (req, res, next) {
      Promise.resolve(handlers[key](req, res, next)).catch(next)
    }
  })

  return wrappedHandlers
}