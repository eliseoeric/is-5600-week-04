module.exports = function autoCatch(routes) {
  const wrapped = {}

  for (const key in routes) {
    wrapped[key] = function (req, res, next) {
      routes[key](req, res, next).catch(next)
    }
  }

  return wrapped
}