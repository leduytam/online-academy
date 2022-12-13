import httpStatus from 'http-status';

import configs from '../configs/index.js';
import User from '../models/user.model.js';

const login = async (req, res, next) => {
  if (req.error) {
    res.locals.error = req.error;
    res.status(httpStatus.BAD_REQUEST).render('login');
    return;
  }

  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.verifyPassword(password))) {
    res.locals.error = 'Incorrect email or password';
    res.render('login');
    return;
  }

  user.password = undefined;

  req.session.user = user;

  if (rememberMe) {
    req.session.cookie.maxAge = configs.rememberMeMaxAge;
  }

  res.status(httpStatus.OK).redirect(req.session.backUrl || '/');
};

const register = async (req, res, next) => {
  if (req.error) {
    res.locals.errorMessage = req.error;
    res.status(httpStatus.BAD_REQUEST).render('register');
    return;
  }

  const { name, email, password } = req.body;

  if (await User.isEmailTaken(email)) {
    res.locals.errorMessage = 'Email already in use';
    res.status(httpStatus.BAD_REQUEST).render('register');
    return;
  }

  await User.create({
    name,
    email,
    password,
  });

  res.status(httpStatus.CREATED).redirect('/login');
};

const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect(req.headers.referer || '/');
  });
};

const getLogInView = async (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
    return;
  }

  res.render('login');
};

const getRegisterView = async (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
    return;
  }

  res.render('register');
};

export default {
  login,
  register,
  logout,
  getLogInView,
  getRegisterView,
};
