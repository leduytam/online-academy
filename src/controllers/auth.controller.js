import httpStatus from 'http-status';

import configs from '../configs/index.js';
import User from '../models/user.model.js';
import emailService from '../services/email.service.js';
import otpService from '../services/otp.service.js';

const login = async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.verifyPassword(password))) {
    req.flash('error', 'Invalid email or password');
    res.redirect('/login');
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
  const { name, email, password, otp } = req.body;

  if (await User.isEmailTaken(email)) {
    req.flash('error', 'Email already in use');
    res.redirect('/register');
    return;
  }

  const isOtpValid = await otpService.verify(email, otp, 'verify');

  if (!isOtpValid) {
    req.flash('error', 'Invalid OTP');
    res.redirect('/register');
    return;
  }

  await otpService.deleteOtp(email, 'verify');

  await User.create({
    name,
    email,
    password,
  });

  req.flash('success', 'Account created successfully');
  res.redirect('/login');
};

const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect(req.headers.referer || '/');
  });
};

const resetPassword = async (req, res, next) => {
  const { email, password, otp } = req.body;

  const user = await User.findOne({ email });

  const isOtpValid = await otpService.verify(email, otp, 'reset-password');

  if (!isOtpValid || !user) {
    req.flash('error', 'Failed to reset password. Please try again later.');
    res.redirect('/forgot-password');
    return;
  }

  await otpService.deleteOtp(email, 'reset-password');

  user.password = password;
  await user.save();

  req.flash('success', 'Password reset successfully');
  res.redirect('/login');
};

const sendVerifyOtp = async (req, res, next) => {
  const { email } = req.body;

  if (await User.isEmailTaken(email)) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: 'Email is already taken',
    });
    return;
  }

  const otp = await otpService.create(email, 'verify');
  emailService.sendOtp(email, otp);

  res.status(httpStatus.OK).json({
    message: 'OTP has been sent to your email',
  });
};

const sendResetPasswordOtp = async (req, res, next) => {
  const { email } = req.body;

  if (await User.isEmailTaken(email)) {
    const otp = await otpService.create(email, 'reset-password');
    emailService.sendOtp(email, otp);
  }

  res.status(httpStatus.OK).json({
    message: 'An OTP has been sent to your email',
  });
};

const getLogInView = async (req, res, next) => {
  res.render('login');
};

const getRegisterView = async (req, res, next) => {
  res.render('register');
};

const getForgotPasswordView = async (req, res, next) => {
  res.render('forgotPassword');
};

export default {
  login,
  register,
  logout,
  resetPassword,
  sendVerifyOtp,
  sendResetPasswordOtp,
  getLogInView,
  getRegisterView,
  getForgotPasswordView,
};
