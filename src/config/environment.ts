import { logger } from '../utils/logger';
import dotenv = require('dotenv');

export const init = () => {
  dotenv.config({ path: '.env' });

  if (!process.env.MONGO_URL) {
    logger.error('No Mongo connection string. Set MONGO_URL environment variable.');
    process.exit(1);
  }

  if (!process.env.REDIS_URL) {
    logger.error('No redis connection string. Set REDIS_URL environment variable.');
    process.exit(1);
  }
};
