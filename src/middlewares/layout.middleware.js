const roleLayout = (req, res, next) => {
  res.locals.layout = req.session?.user?.role || 'student';
  next();
};

const baseLayout = (req, res, next) => {
  res.locals.layout = 'base';
  next();
};

export default {
  roleLayout,
  baseLayout,
};
