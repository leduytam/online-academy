import httpStatus from 'http-status';
import mongoose from 'mongoose';

import configs from '../configs/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const errorConverter = (err, req, res, next) => {
  if (err instanceof ApiError) {
    next(err);
  }

  const statusCode =
    err.statusCode || err instanceof mongoose.Error
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;

  const message = err.message || httpStatus[statusCode];

  next(new ApiError(statusCode, message, false, err.stack));
};

export const error404Handler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  res.render('notFound');
};

export const errorHandler = (err, req, res, next) => {
  res.locals.statusCode = err.statusCode;
  res.locals.message = err.message;

  if (configs.env === 'production' && !err.isOperational) {
    res.locals.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    res.locals.message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  if (configs.env === 'development') {
    logger.error(err);
    res.locals.stack = err.stack;
  }

  res.status(res.locals.statusCode);
  res.render('error');
};
