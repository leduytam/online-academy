import ERole from '../constant/role.js';
import categoryService from '../services/category.service.js';

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
  return async (req, res, next) => {
    if (emptyLayout) {
      res.locals.layout = 'empty';
      next();
      return;
    }

    res.locals.layout = req.session?.user?.role || ERole.STUDENT;

    if (res.locals.layout === ERole.STUDENT) {
      res.locals.categories = await categoryService.getAll();
    }

    next();
  };
};

export default {
  message,
  user,
  layout,
};
