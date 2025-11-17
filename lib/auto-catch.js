// lib/auto-catch.js
module.exports = function autoCatch(handlers) {
  const wrapped = {};
  for (const [key, fn] of Object.entries(handlers)) {
    wrapped[key] = function (req, res, next) {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
  return wrapped;
};
