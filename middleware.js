// middleware.js
/**
 * Handle errors
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function handleError (err, req, res, next) {
    // Log the error to our server's console
    console.error(err)
    
    // If the response has already been sent, we can't send another response
    if (res.headersSent) {
      return next(err)
    }
  
    // Send a 500 error response
    res.status(500).json({ error: "Internal Error Occurred" })
  }
  
  /**
   * Send a 404 response if no route is found
   * @param {object} req
   * @param {object} res
   */
  function notFound (req, res) {
    res.status(404).json({ error: "Not Found" })
  }
  