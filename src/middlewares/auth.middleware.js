const protect = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.session.backUrl = req.originalUrl;
    res.redirect('/login');
  }
};

const localUser = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }

  next();
};

const verify = (req, res, next) => {
  if (
    req.path === '/verify' ||
    (req.path === '/logout' && req.method === 'POST') ||
    (req.path === '/resend-verify-otp' && req.method === 'POST') ||
    !req.session.user ||
    req.session.user.isVerified
  ) {
    next();
    return;
  }

  res.redirect('/verify');
};

export default {
  protect,
  localUser,
  verify,
};
