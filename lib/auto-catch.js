/**
 * Automatically wraps route handler functions to catch and forward errors.
 * This reduces boilerplate code for try-catch blocks in each route.
 * 
 * @param {object} handlers - An object containing route handler functions.
 * @returns {object} - An object with the same keys as handlers, but the values
 *                     are wrapped to handle errors automatically.
 */
module.exports = function autoCatch(handlers) {
  return Object.keys(handlers).reduce((wrappedHandlers, key) => {
    const handler = handlers[key];

    // Wrap each handler to handle async errors
    wrappedHandlers[key] = async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        console.error(`[Error in ${key}]:`, err.message); // Log error details
        next(err); // Forward the error to the error handler middleware
      }
    };
    return wrappedHandlers;
  }, {});
};
