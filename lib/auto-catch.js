module.exports = function autoCatch (handlers) {
  if (typeof handlers === 'function') {
    return catchErrors(handlers)
  }

  const wrapped = {}
  for (const key of Object.keys(handlers)) {
    wrapped[key] = catchErrors(handlers[key])
  }
  return wrapped
}

function catchErrors (fn) {
  return function (req, res, next) {
    const result = fn(req, res, next)
    return Promise.resolve(result).catch(next)
  }
}