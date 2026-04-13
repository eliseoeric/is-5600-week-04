module.exports = function autoCatch(routes) {
  const wrapped = {}

  for (const key in routes) {
    wrapped[key] = (req, res, next) => {
      Promise.resolve(routes[key](req, res, next)).catch(next)
    }
  }

  return wrapped
}