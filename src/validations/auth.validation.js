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
    password: Joi.string()
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.-^*()%!])[A-Za-z\d$&+,:;=?@#|'<>.-^*()%!]{8,}$/
      )
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

const verify = {
  body: {
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
  verify,
};
