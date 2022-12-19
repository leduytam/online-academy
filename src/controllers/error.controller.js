const getErrorNotFoundView = (req, res, next) => {
  res.render('errors/404', {
    title: 'Page not found',
  });
};

const getForbiddenErrorView = (req, res, next) => {
  res.render('errors/403', {
    title: 'Forbidden',
  });
};

const getInternalErrorView = (req, res, next) => {
  res.render('errors/500', {
    title: 'Something went wrong',
  });
};

export default {
  getErrorNotFoundView,
  getForbiddenErrorView,
  getInternalErrorView,
};
