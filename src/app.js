import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { engine } from 'express-handlebars';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import httpStatus from 'http-status';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import xss from 'xss-clean';

import configs from './configs/index.js';
import camelcase from './middlewares/camelcase.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import routes from './routes/v1/index.js';
import ApiError from './utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

if (configs.env === 'production') {
  app.use(
    rateLimit({
      max: 1000,
      windowMs: 1000 * 60 * 60,
      message: 'Too many requests! Please try again later',
    })
  );
}

if (configs.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan());
}

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      },
    },
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());
app.options('*', cors());

app.use(
  hpp({
    whitelist: [],
  })
);

app.use(xss());

app.use(mongoSanitize());

app.use(compression());

app.use(camelcase());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', routes);

app.use((req, res, next) => {
  throw new ApiError(httpStatus.NOT_FOUND, `Not found ${req.originalUrl}`);
});

app.use(errorHandler);

export default app;
