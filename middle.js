/**
 * Set the CORS headers on the response object
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function cors(req, res, next) {
    const origin = req.headers.origin;

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
                'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        });
        return res.end();
    }

    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
}

/**
 * Handle errors in the application
 * @param {Error} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function handleError(err, req, res, next) {
    console.error(err.stack || err.message);

    if (res.headersSent) {
        return next(err);
    }

    const response =
        process.env.NODE_ENV === 'production'
            ? { error: 'Internal Server Error' }
            : { error: err.message || 'An error occurred' };

    res.status(500).json(response);
}

/**
 * Handle 404 - Not Found
 * @param {object} req
 * @param {object} res
 */
function notFound(req, res) {
    console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Not Found' });
}

module.exports = {
    cors,
    handleError,
    notFound,
};
