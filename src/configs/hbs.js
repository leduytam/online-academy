import exphbs from 'express-handlebars';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

const helpers = {
  lte: (a, b) => +a <= +b,
  lt: (a, b) => +a < +b,
  gte: (a, b) => +a >= +b,
  gt: (a, b) => +a > +b,
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  in: (a, b) => b.includes(a),
  nin: (a, b) => !b.includes(a),
  round: (a) => Math.round(a),
  roundWithPrecision: (a, precision) => {
    const factor = 10 ** precision;
    return Math.round((a + Number.EPSILON) * factor) / factor;
  },
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
};

const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'student',
  extname: '.hbs',
  helpers,
});

export default hbs;
