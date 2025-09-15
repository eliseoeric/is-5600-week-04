module.exports = function autoCatch (handlers) {
  const wrapped = {}
  Object.keys(handlers).forEach((key) => {
    const fn = handlers[key]
    if (typeof fn !== 'function') return
    wrapped[key] = (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  })
  return wrapped
}
