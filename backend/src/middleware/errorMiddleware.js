export const notFoundHandler = (_req, _res, next) => {
  const error = new Error("Route not found.");
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server error.";

  res.status(statusCode).json({
    message
  });
};

