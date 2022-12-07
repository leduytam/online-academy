import winston from 'winston';

import configs from '../configs/index.js';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }

  return info;
});

const logger = winston.createLogger({
  level: configs.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    configs.env === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm-ss' }),
    winston.format.splat(),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
