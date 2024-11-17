module.exports = function autoCatch(handlers) {
    return Object.keys(handlers).reduce((acc, key) => {
      acc[key] = (req, res, next) => Promise.resolve(handlers[key](req, res, next)).catch(next);
      return acc;
    }, {});
  };
  