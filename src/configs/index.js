import dotenv from 'dotenv';
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
};

export default configs;
