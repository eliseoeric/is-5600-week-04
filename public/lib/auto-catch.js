function autoCatch(handlers) {
  if (typeof handlers === 'function') {
    return wrap(handlers);
  }

  return Object.keys(handlers).reduce((acc, key) => {
    acc[key] = wrap(handlers[key]);
    return acc;
  }, {});
}

function wrap(fn) {
  return function asyncHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = autoCatch;