const protect = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.session.backUrl = req.originalUrl;
    res.redirect('/login');
  }
};

const preventAuth = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};

const restrictTo = (roles) => {
  return (req, res, next) => {
    const userRole = req.session?.user?.role || 'student';

    if (roles.includes(userRole)) {
      next();
    } else {
      res.redirect('/forbidden');
    }
  };
};

export default {
  protect,
  preventAuth,
  restrictTo,
};
