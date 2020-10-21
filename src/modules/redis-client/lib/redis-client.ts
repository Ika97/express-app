// IMPORT MODULES
import redis = require('redis');
import { logger } from '../../../utils/logger';

export class RedisClient {
  public id;
  public client;

  constructor(id, connectionString) {
    this.id = id;
    this.client = redis.createClient(connectionString);
  }

  public async init() {
    let clientName = this.id;
    let redisClient = this.client;

    redisClient.on('error', function(error) {

      logger.error('Redis Error: ' + clientName + ': ' + error);
    });
    redisClient.on('monitor', function(time, args) {

      logger.info(time + ': ' + args);
    });

    return new Promise((resolve) => {
      redisClient.on('connect', function() {

        logger.info('Redis Connected: ' + clientName);
        resolve(true);
      });
    });
  }
}
