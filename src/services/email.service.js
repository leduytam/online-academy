import nodemailer from 'nodemailer';

import configs from '../configs/index.js';
import logger from '../utils/logger.js';

const transport = nodemailer.createTransport(configs.email.smtp);

transport
  .verify()
  .then(() => {
    logger.info('Connected to email server');
  })
  .catch((err) => {
    logger.warn('Failed to connect to email server');
  });

const sendEmail = async (to, subject, html) => {
  await transport.sendMail({
    from: configs.email.from,
    to,
    subject,
    html,
  });
};

export default {
  sendEmail,
};
