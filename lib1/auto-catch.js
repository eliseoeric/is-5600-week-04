module.exports = function autoCatch(handlers) {
  const wrapped = {}

  for (const key of Object.keys(handlers)) {
    const fn = handlers[key]
    wrapped[key] = function(req, res, next) {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  }

  return wrapped
}
