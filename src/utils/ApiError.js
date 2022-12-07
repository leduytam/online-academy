class ApiError extends Error {
  constructor(statusCode, message, isOperational) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
