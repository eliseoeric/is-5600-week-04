/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
    const origin = req.headers.origin;
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS, XMODIFY"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Max-Age", "86400");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    );
    next();
  }
  
  /**
   * Handle server errors (500)
   * @param {object} err
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  function handleError(err, req, res, next) {
    console.error(err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: "Internal Error Occurred" });
  }
  
  /**
   * Handle 404 - Not Found routes
   * @param {object} req
   * @param {object} res
   */
  function notFound(req, res) {
    res.status(404).json({ error: "Not Found" });
  }
  
  module.exports = {
    cors,
    handleError,
    notFound,
  };