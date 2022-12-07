import httpStatus from 'http-status';

const get = async (req, res, next) => {
  res.status(httpStatus.OK).render('home', {
    title: 'Home page',
  });
};

export default {
  get,
};
