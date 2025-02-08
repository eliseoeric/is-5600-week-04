function cors(req, res, next) {
    const origin = req.headers.origin;
  
    // Set the CORS (Cross-Origin Resource Sharing) headers
    // Allow requests from the origin provided in the request, or allow all origins (*)
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  
    // Define the allowed HTTP methods for cross-origin requests
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS, XMODIFY",
    );
  
    // Allow credentials (such as cookies or HTTP authentication) to be sent with requests
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    // Specify how long (in seconds) the results of a preflight request can be cached
    res.setHeader("Access-Control-Max-Age", "86400");
  
    // Specify the allowed headers in cross-origin requests
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    );
  
    // Pass the request to the next middleware in the stack
    next();
  }
  
  function handleError(err, req, res, next) {
    // Log the error to the server's console for debugging purposes
    console.error(err);
  
    // If headers have already been sent, delegate the error to the next error-handling middleware
    if (res.headersSent) {
      return next(err);
    }
  
    // Send a 500 Internal Server Error response with an error message
    res.status(500).json({ error: "Internal Error Occurred" });
  }
  
  function notFound(req, res) {
    // Send a 404 Not Found response when the requested resource does not exist
    res.status(404).json({ error: "Not Found" });
  }
  
  module.exports = {
    cors, // Export the CORS middleware
    handleError, // Export the error-handling middleware
    notFound, // Export the 404 Not Found handler
  };
  