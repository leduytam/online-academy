import httpStatus from 'http-status';

import configs from '../configs/index.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

export const errorConverter = (err, req, res, next) => {
  if (err instanceof AppError) {
    next(err);
  }

  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || httpStatus[statusCode];

  next(new AppError(statusCode, message, false, err.stack));
};

export const error404Handler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  res.render('404');
};

export const errorHandler = (err, req, res, next) => {
  const error = {
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack.replaceAll('\n', '<br />'),
  };

  if (configs.env === 'production') {
    res.redirect('/500');
    return;
  }

  logger.error(err);
  res.render('errors/error', { error, layout: 'empty', title: 'Error' });
};
