module.exports = function autoCatch(handlers) {
  return Object.keys(handlers).reduce((acc, key) => {
    const handler = handlers[key];
    acc[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next);
    return acc;
  }, {});
};
