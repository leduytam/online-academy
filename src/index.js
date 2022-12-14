import mongoose from 'mongoose';

import app from './app.js';
import configs from './configs/index.js';
import logger from './utils/logger.js';

logger.log('info', 'Connecting to MongoDB...');

let server;

mongoose.set('strictQuery', false);
mongoose
  .connect(configs.mongoose.url, configs.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB');

    server = app.listen(configs.port, () => {
      logger.info(`Server is running at http://localhost:${configs.port}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB');
    throw err;
  });

const unexpectedErrorHandler = (err) => {
  logger.error(err);

  if (server) {
    server.close(() => {
      logger.info('Server is closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');

  if (server) {
    server.close();
  }
});
