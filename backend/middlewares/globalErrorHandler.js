import { NODE_ENV } from '../config/env.js';

const globalErrorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Unexpected Error';
  let operation = error.operation || 'Unknown Operation';

  if (error.name === 'Validation Error') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(', ');
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}.`;
  }

  if (error.name === 'MongoNetworkError') {
    statusCode = 503;
    message = 'Database service is unavailable.';
  }

  if (error.code === 11000) {
    error.statusCode = 409;
    message = 'A resource with the same unique value already exists.';
  }

  if (NODE_ENV === 'production' && !error.isOperational) {
    message = 'Something went wrong!';
  }

  res.status(statusCode).json({
    status: 'error',
    message: `Error at: ${operation}, ${message}`,
    stack: NODE_ENV === 'development' ? error.stack : undefined,
  });
};

export default globalErrorHandler;
