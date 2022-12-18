import Joi from 'joi';

export default Joi.object()
  .keys({
    PORT: Joi.number().default(8000),
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),

    MONGODB_URL: Joi.string().required(),

    SESSION_SECRET: Joi.string().required(),
    SESSION_MAX_AGE: Joi.string().default('1h'),
    REMEMBER_ME_MAX_AGE: Joi.string().default('7d'),

    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().required(),
    SMTP_USERNAME: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
    EMAIL_FROM: Joi.string().required(),

    OTP_MAX_AGE: Joi.string().default('30m'),
  })
  .options({ stripUnknown: true });
