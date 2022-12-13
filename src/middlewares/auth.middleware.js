const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.session.backUrl = req.originalUrl;
    res.redirect('/login');
  }
};

export default {
  auth,
};
