import Joi from 'joi';
import _ from 'lodash';

const validate = (schema, abortEarly = true) => {
  return (req, res, next) => {
    const validSchema = _.pick(schema, ['body', 'params', 'query']);

    const { error } = Joi.compile(validSchema)
      .prefs({ abortEarly })
      .validate(_.pick(req, Object.keys(validSchema)));

    req.error = error?.details.map((detail) => detail.message).join(', ');

    next();
  };
};

export default validate;
