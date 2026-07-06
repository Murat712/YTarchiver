class AppError extends Error {
  constructor(message, statusCode, operation) {
    super(message);
    this.statusCode = statusCode;
    this.operation = operation;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
