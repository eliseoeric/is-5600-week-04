module.exports = function autoCatch (handlers) {
  return Object.keys(handlers).reduce((autoHandlers, key) => {
    const handler = handlers[key]
    autoHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next)
    return autoHandlers
  }, {})
}
module.exports = function autoCatch(handlers) {
  return Object.keys(handlers).reduce((wrapped, key) => {
    const fn = handlers[key];
    wrapped[key] = (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
    return wrapped;
  }, {});
};
