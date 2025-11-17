// lib/auto-catch.js
// Wraps async route handlers to catch rejections and forward to next(err)
module.exports = function autoCatch(handlers) {
  const wrapped = {};
  Object.keys(handlers).forEach(key => {
    const fn = handlers[key];
    wrapped[key] = function(...args) {
      // if Express passes (req, res, next)
      const maybePromise = fn(...args);
      if (maybePromise && maybePromise.catch) {
        maybePromise.catch(err => {
          // express error middleware expects next(err) as third param
          const next = args[2];
          if (typeof next === 'function') return next(err);
          console.error('Unhandled promise rejection', err);
        });
      }
    };
  });
  return wrapped;
};