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

export default {
  protect,
  preventAuth,
};
