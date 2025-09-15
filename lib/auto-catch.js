// Automatically catches errors in async functions
module.exports = (handlers) => {
  const wrapped = {};
  for (const key in handlers) {
    wrapped[key] = async (req, res, next) => {
      try {
        await handlers[key](req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
  return wrapped;
};
