import httpStatus from 'http-status';
import Joi from 'joi';
import _ from 'lodash';

export const validateRedirect = (
  schema,
  failureRedirect,
  abortEarly = true
) => {
  return (req, res, next) => {
    const validSchema = _.pick(schema, ['body', 'params', 'query']);

    const { error: errors } = Joi.compile(validSchema)
      .prefs({ abortEarly })
      .validate(_.pick(req, Object.keys(validSchema)));

    if (!errors) {
      next();
      return;
    }

    req.session.error = errors.details
      .map((detail) => detail.message)
      .join(', ');

    req.session.save((err) => {
      res.redirect(failureRedirect || req.path);
    });
  };
};

export const validateReJson = (schema, abortEarly = true) => {
  return (req, res, next) => {
    const validSchema = _.pick(schema, ['body', 'params', 'query']);

    const { error: errors } = Joi.compile(validSchema)
      .prefs({ abortEarly })
      .validate(_.pick(req, Object.keys(validSchema)));

    if (!errors) {
      next();
      return;
    }

    res.status(httpStatus.BAD_REQUEST).json({
      message: errors.details.map((detail) => detail.message).join(', '),
    });
  };
};

export const validate = (schema, abortEarly = true) => {
  return (req, res, next) => {
    const validSchema = _.pick(schema, ['body', 'params', 'query']);

    const { error: errors } = Joi.compile(validSchema)
      .prefs({ abortEarly })
      .validate(_.pick(req, Object.keys(validSchema)));

    if (!errors) {
      next();
      return;
    }

    req.error = errors.details.map((detail) => detail.message).join(', ');

    next();
  };
};
