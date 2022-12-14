const roleLayout = (req, res, next) => {
  res.locals.layout = req.session?.user?.role || 'student';
  next();
};

const emptyLayout = (req, res, next) => {
  res.locals.layout = 'empty';
  next();
};

export default {
  roleLayout,
  emptyLayout,
};
