import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import ms from 'ms';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, '..', '..', '.env'),
});

const configs = {
  env: process.env.NODE_ENV || 'development',
  port: +process.env.PORT || 8000,
  mongoose: {
    url: process.env.MONGODB_URL,
    options: {},
  },
  session: {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: ms(process.env.SESSION_MAX_AGE || '2h'),
      secure: process.env.NODE_ENV === 'production',
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  },
  rememberMeMaxAge: ms(process.env.REMEMBER_ME_MAX_AGE || '7d'),
};

export default configs;
