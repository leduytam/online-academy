import Joi from 'joi';

export default {
  createUserBody: {
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
    name: Joi.string().required().messages({
      'string.empty': 'Name is required',
    }),
    role: Joi.string().required().messages({
      'string.empty': 'Role is required',
    }),
  },
  editUserBody: {
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
    name: Joi.string().required().messages({
      'string.empty': 'Name is required',
    }),
    role: Joi.string().required().messages({
      'string.empty': 'Role is required',
    }),
  },
};
