const message = (req, res, next) => {
  const [error] = req.flash('error');
  const [success] = req.flash('success');

  res.locals.error = error;
  res.locals.success = success;

  next();
};

const user = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};

const layout = (emptyLayout = false) => {
  return (req, res, next) => {
    if (emptyLayout) {
      res.locals.layout = 'empty';
      next();
      return;
    }

    res.locals.layout = req.session?.user?.role || 'student';
    next();
  };
};

export default {
  message,
  user,
  layout,
};
