import compression from 'compression';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import exphbs from 'express-handlebars';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import xss from 'xss-clean';

import configs from './configs/index.js';
import './configs/mongoose.js';
import {
  error404Handler,
  errorConverter,
  errorHandler,
} from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'base',
  extname: '.hbs',
  helpers: {},
});

app.engine('.hbs', hbs.engine);
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

app.use(morgan(configs.env === 'development' ? 'dev' : 'tiny'));

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      },
    },
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({ ...configs.session }));

app.use(cors());
app.options('*', cors());

app.use(xss());
app.use(mongoSanitize());

app.use(compression());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', routes);

app.use(error404Handler);
app.use(errorConverter);
app.use(errorHandler);

export default app;
