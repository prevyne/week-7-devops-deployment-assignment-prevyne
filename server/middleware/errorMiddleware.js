const errorHandler = (err, req, res, next) => {
  // If Sentry is handling the error, let it
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // Show stack trace only in development environment
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };