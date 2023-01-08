import exphbs from 'express-handlebars';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import path from 'path';
import { fileURLToPath } from 'url';

import gcsService from '../services/gcs.service.js';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const helpers = {
  lte: (a, b) => +a <= +b,
  lt: (a, b) => +a < +b,
  gte: (a, b) => +a >= +b,
  gt: (a, b) => +a > +b,
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  in: (a, b) => b.includes(a),
  nin: (a, b) => !b.includes(a),
  or: (a, b) => a || b,
  and: (a, b) => a && b,
  round: (a) => Math.round(a),
  roundWithPrecision: (a, precision) => {
    const factor = 10 ** precision;
    return Math.round((a + Number.EPSILON) * factor) / factor;
  },
  roundHalf: (a) => Math.round(a * 2) / 2,
  math: (a, operator, b) => {
    switch (operator) {
      case '+':
        return +a + +b;
      case '-':
        return +a - +b;
      case '*':
        return +a * +b;
      case '/':
        return +a / +b;
      case '%':
        return +a % +b;
      default:
        return null;
    }
  },
  range: (start, end, step, options) => {
    let accum = '';

    for (let i = start; i <= end; i += step) {
      accum += options.fn(i);
    }

    return accum;
  },
  rangeReverse: (start, end, step, options) => {
    let accum = '';

    for (let i = start; i >= end; i -= step) {
      accum += options.fn(i);
    }

    return accum;
  },
  secondToMinute: (seconds) => Math.floor(seconds / 60),
  timeAgo: (date) => {
    return timeAgo.format(new Date(date));
  },
  gcsPublicUrl: (filename) => gcsService.getPublicImageUrl(filename),
  currency: (number) => currencyFormatter.format(number),
};

const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'student',
  extname: '.hbs',
  helpers,
});

export default hbs;
