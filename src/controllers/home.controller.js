import httpStatus from 'http-status';

import catchAsync from '../utils/catchAsync.js';

const get = catchAsync(async (req, res, next) => {
  res.status(httpStatus.OK).render('home', {
    title: 'Home page',
  });
});

export default {
  get,
};
