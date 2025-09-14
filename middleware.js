function cors(req, res, next) {
    const origin = req.headers.origin;
    // Set the CORS headers
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS, MODIFY",
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Max-Age", "86400");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    );
    next();
  }

  function handleError(err, req, res, next) {
    // log the error to our server's console
    console.error(err);
    // if the response has already been sent, we cant send another res
    if (res.headersSent) {
      return next(err);
    }
    // send a 500 error response
    res.status(500).json({ error: "Internal Error Occurred" });
  }

  function notFound(reg, res) {
    res.status(404).json({ error: "Not Found" });
  }

  module.exports = {
    cors,
    handleError,
    notFound,
  };