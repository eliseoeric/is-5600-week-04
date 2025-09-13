module.exports = function autoCatch(handlers) {
  const newHandlers = {}
  Object.keys(handlers).forEach(key => {
    const handler = handlers[key]
    newHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next)
  })
  return newHandlers
}
