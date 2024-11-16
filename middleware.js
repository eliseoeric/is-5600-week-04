/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
    const origin = req.headers.origin || '*';

    // Set the CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No content
    }

    next();
}

/**
 * Error handling middleware
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

    res.status(500).json({ error: "Internal Server Error" });
}

/**
 * Middleware for handling 404 Not Found errors
 * @param {object} req
 * @param {object} res
 */
function notFound(req, res) {
    res.status(404).json({ error: "Resource Not Found" });
}

module.exports = {
    cors,
    handleError,
    notFound,
};

