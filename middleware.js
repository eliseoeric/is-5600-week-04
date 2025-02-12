// Middleware to handle Cross-Origin Resource Sharing (CORS)
function cors(req, res, next) {
    const origin = req.headers.origin;  // Get the origin of the incoming request
    // Set CORS headers to allow cross-origin requests from the specified origin or any origin (wildcard "*")
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    // Define allowed HTTP methods for the requests
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS, XMODIFY",
    );
    // Allow credentials (cookies, HTTP authentication) to be included in cross-origin requests
    res.setHeader("Access-Control-Allow-Credentials", true);
    // Set the max time in seconds that the results of a preflight request can be cached
    res.setHeader("Access-Control-Max-Age", "86400");
    // Define the allowed request headers for the cross-origin request
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    );
    next(); // Proceed to the next middleware or request handler
}

// Middleware to handle errors
function handleError(err, req, res, next) {
    // Log the error to the server's console for debugging purposes
    console.error(err);
    // If the response has already been sent, proceed to the next error handler
    if (res.headersSent) {
      return next(err);
    }
    // Send a 500 Internal Server Error response with a generic error message
    res.status(500).json({ error: "Internal Error Occurred" });
}

// Middleware to handle 404 errors (when a route is not found)
function notFound(req, res) {
    // Send a 404 Not Found response with an error message
    res.status(404).json({ error: "Not Found" });
}

module.exports = {
    cors,
    handleError,
    notFound,
};
