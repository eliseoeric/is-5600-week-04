module.exports = function autoCatch (handlers) {
  return Object.keys(handlers).reduce((autoHandlers, key) => {
    const handler = handlers[key]
    autoHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next)
    return autoHandlers
  }, {})
}
function autoCatch(methods) {
  const result = {};

  Object.keys(methods).forEach(method => {
    result[method] = async (req, res, next) => {
      try {
        await methods[method](req, res, next);
      } catch (err) {
        next(err);  
      }
    };
  });

  return result;
}

module.exports = autoCatch;
