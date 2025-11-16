module.exports = function autoCatch(handlers) {
  const newHandlers = {}

  Object.keys(handlers).forEach(key => {
    const handler = handlers[key]

    if (typeof handler === 'function') {
      newHandlers[key] = function(req, res, next) {
        return Promise.resolve(handler(req, res, next)).catch(next)
      }
    }
  })

  return newHandlers
}