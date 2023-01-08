import httpStatus from 'http-status';

import configs from '../configs/index.js';
import ERole from '../constant/role.js';
import User from '../models/user.model.js';
import emailService from '../services/email.service.js';
import otpService from '../services/otp.service.js';

const login = async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email, isDeleted: false }).select(
    '+password'
  );

  if (!user || !(await user.verifyPassword(password))) {
    req.session.error = 'Invalid email or password';
    req.session.save((err) => {
      res.redirect('/login');
    });
    return;
  }

  user.password = undefined;

  req.session.user = user;

  if (rememberMe) {
    req.session.cookie.maxAge = configs.rememberMeMaxAge;
  }

  req.session.save((err) => {
    if (user.role !== ERole.ADMIN) {
      res.redirect(req.session.backUrl || '/');
    } else {
      res.redirect('/admin');
    }
  });
};

const register = async (req, res, next) => {
  const { name, email, password, otp } = req.body;

  if (await User.isEmailTaken(email)) {
    req.session.error = 'Email already in use';
    req.session.save((err) => {
      res.redirect('/register');
    });
    return;
  }

  const isOtpValid = await otpService.verify(email, otp, 'verify');

  if (!isOtpValid) {
    req.session.error = 'Invalid OTP';
    req.session.save((err) => {
      res.redirect('/register');
    });
    return;
  }

  await otpService.deleteOtp(email, 'verify');

  await User.create({
    name,
    email,
    password,
  });

  req.session.success = 'Account created successfully';
  req.session.save((err) => {
    res.redirect('/login');
  });
};

const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect(req.headers.referer || '/');
  });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const { _id } = req.session.user;

  const user = await User.findById(_id).select('+password');

  const redirectUrl =
    user.role === ERole.STUDENT ? '/profile' : '/instructor/profile';

  if (req.error) {
    req.session.error = req.error;
    req.session.save((err) => {
      res.redirect(redirectUrl);
    });
    return;
  }

  if (!(await user.verifyPassword(oldPassword))) {
    req.session.error = 'Invalid old password';
    req.session.save((err) => {
      res.redirect(redirectUrl);
    });
    return;
  }

  user.password = newPassword;
  await user.save();

  req.session.success = 'Password changed successfully';
  req.session.save((err) => {
    res.redirect(redirectUrl);
  });
};

const resetPassword = async (req, res, next) => {
  const { email, password, otp } = req.body;

  const user = await User.findOne({ email });

  const isOtpValid = await otpService.verify(email, otp, 'reset-password');

  if (!isOtpValid || !user) {
    req.session.error = 'Failed to reset password. Please try again later.';
    req.session.save((err) => {
      res.redirect('/forgot-password');
    });
    return;
  }

  await otpService.deleteOtp(email, 'reset-password');

  user.password = password;
  await user.save();

  req.session.success = 'Password reset successfully';
  req.session.save((err) => {
    res.redirect('/login');
  });
};

const changeEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const { _id } = req.session.user;

  const user = await User.findById(_id);

  const redirectUrl =
    user.role === ERole.STUDENT ? '/profile' : '/instructor/profile';

  const isOtpValid = await otpService.verify(email, otp, 'change-email');

  if (!isOtpValid) {
    req.session.error = 'Invalid OTP';
    req.session.save((err) => {
      res.redirect(redirectUrl);
    });
    return;
  }

  await otpService.deleteOtp(email, 'change-email');

  user.email = email;

  await user.save();

  req.session.user = user;
  req.session.success = 'Email changed successfully';

  req.session.save((err) => {
    res.redirect(redirectUrl);
  });
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

const sendChangeEmailOtp = async (req, res, next) => {
  const { email } = req.body;

  if (await User.isEmailTaken(email)) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: 'Email is already taken',
    });
    return;
  }

  const otp = await otpService.create(email, 'change-email');
  emailService.sendOtp(email, otp);

  res.status(httpStatus.OK).json({
    message: 'OTP has been sent to your email',
  });
};

const getLogInView = async (req, res, next) => {
  res.render('login', {
    title: 'Login',
  });
};

const getRegisterView = async (req, res, next) => {
  res.render('register', {
    title: 'Register',
  });
};

const getForgotPasswordView = async (req, res, next) => {
  res.render('forgotPassword', {
    title: 'Forgot Password',
  });
};

export default {
  login,
  register,
  logout,
  changePassword,
  resetPassword,
  sendVerifyOtp,
  sendResetPasswordOtp,
  getLogInView,
  getRegisterView,
  getForgotPasswordView,
  changeEmail,
  sendChangeEmailOtp,
};
