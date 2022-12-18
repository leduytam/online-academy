import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import ms from 'ms';
import path from 'path';
import { fileURLToPath } from 'url';

import envSchema from '../validations/env.validation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, '..', '..', '.env'),
});

const { value: env, error } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`ENV Errors: ${error.message}`);
}

const configs = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongoose: {
    url: env.MONGODB_URL,
    options: {},
  },
  session: {
    secret: env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: ms(env.SESSION_MAX_AGE),
      secure: env.NODE_ENV === 'production',
    },
    store: MongoStore.create({
      mongoUrl: env.MONGODB_URL,
    }),
  },
  rememberMeMaxAge: ms(env.REMEMBER_ME_MAX_AGE),
  email: {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
      },
    },
    from: env.EMAIL_FROM,
  },
  otp: {
    maxAge: ms(env.OTP_MAX_AGE),
  },
};

export default configs;
