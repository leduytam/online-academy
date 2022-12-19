import Joi from 'joi';

const login = {
  body: {
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
    }),
    rememberMe: Joi.boolean(),
  },
};

const register = {
  body: {
    name: Joi.string().required().messages({
      'string.empty': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
    otp: Joi.string()
      .required()
      .regex(/^\d{6}$/)
      .messages({
        'string.empty': 'OTP is required',
        'string.pattern.base': 'Invalid OTP',
      }),
    password: Joi.string()
      .required()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.empty': 'Password is required',
        'string.pattern.base':
          'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }),
    confirmPassword: Joi.string()
      .required()
      .equal(Joi.ref('password'))
      .messages({
        'any.only': 'Password and confirm password do not match',
        'string.empty': 'Confirm password is required',
      }),
  },
};

const sendVerifyOtp = {
  body: {
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
  },
};

const sendResetPasswordOtp = {
  body: {
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
  },
};

const changePassword = {
  body: {
    oldPassword: Joi.string().required().messages({
      'string.empty': 'Old password is required',
    }),
    newPassword: Joi.string()
      .required()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.empty': 'New password is required',
        'string.pattern.base':
          'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }),
    confirmNewPassword: Joi.string()
      .required()
      .equal(Joi.ref('newPassword'))
      .messages({
        'any.only': 'New password and confirm new password do not match',
        'string.empty': 'Confirm new password is required',
      }),
  },
};

const resetPassword = {
  body: {
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
    password: Joi.string()
      .required()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.empty': 'Password is required',
        'string.pattern.base':
          'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }),
    confirmPassword: Joi.string()
      .required()
      .equal(Joi.ref('password'))
      .messages({
        'any.only': 'Password and confirm password do not match',
        'string.empty': 'Confirm password is required',
      }),
    otp: Joi.string()
      .required()
      .regex(/^\d{6}$/)
      .messages({
        'string.empty': 'OTP is required',
        'string.pattern.base': 'Invalid OTP',
      }),
  },
};

export default {
  login,
  register,
  changePassword,
  resetPassword,
  sendVerifyOtp,
  sendResetPasswordOtp,
};
