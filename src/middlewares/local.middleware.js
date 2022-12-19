const message = (req, res, next) => {
  if (req.session.error || req.session.success) {
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;

    req.session.error = undefined;
    req.session.success = undefined;

    req.session.save((err) => {
      next();
    });

    return;
  }

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
