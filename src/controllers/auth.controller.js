import httpStatus from 'http-status';

import configs from '../configs/index.js';
import User from '../models/user.model.js';
import emailService from '../services/email.service.js';
import otpService from '../services/otp.service.js';

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
    res.status(httpStatus.FORBIDDEN).render('login');
    return;
  }

  user.password = undefined;

  req.session.user = user;

  if (rememberMe) {
    req.session.cookie.maxAge = configs.rememberMeMaxAge;
  }

  req.session.save((err) => {
    res.redirect(req.session.backUrl || '/');
  });
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

  const otp = await otpService.create(email);
  await emailService.sendOtp(email, otp);

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

const verify = async (req, res, next) => {
  if (req.error) {
    res.locals.error = req.error;
    res.status(httpStatus.BAD_REQUEST).render('verify');
    return;
  }

  const { otp } = req.body;
  const { email, isVerified } = req.session.user;

  if (isVerified) {
    res.status(httpStatus.FORBIDDEN).redirect('/');
    return;
  }

  const isOtpValid = await otpService.verify(email, otp);

  if (!isOtpValid) {
    res.locals.error = 'Invalid OTP';
    res.status(httpStatus.BAD_REQUEST).render('verify');
    return;
  }

  await User.updateOne(
    {
      email,
    },
    {
      isVerified: true,
    }
  );

  await otpService.deleteOtp(email);

  req.session.user.isVerified = true;

  req.session.save((err) => {
    res.redirect('/');
  });
};

const resendVerifyOtp = async (req, res, next) => {
  const { email } = req.session.user;
  const otp = await otpService.create(email);
  await emailService.sendOtp(email, otp);

  req.session.message = 'New OTP has been sent to your email';

  req.session.save((err) => {
    res.redirect('/verify');
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

const getVerifyView = async (req, res, next) => {
  if (req.session?.user?.isVerified) {
    res.redirect('/');
    return;
  }

  res.locals.message = req.session.message;
  req.session.message = undefined;

  req.session.save((err) => {
    res.render('verify');
  });
};

export default {
  login,
  register,
  logout,
  verify,
  resendVerifyOtp,
  getLogInView,
  getRegisterView,
  getVerifyView,
};
