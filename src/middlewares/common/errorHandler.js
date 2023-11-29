const createHttpError = require('http-errors');

// 404 not found Handler
function notFoundHandler(req, res, next) {
    next(createHttpError(404, 'Your request connect was not found'));
}

// default error handler
const errorHandler = (err, req, res, next) => {
    res.locals.error = process.env.NODE_ENV === 'development' ? err : { message: err.message };
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json(res.locals.error);
};

module.exports = {
    notFoundHandler,
    errorHandler,
};
