import { RedisClient } from '../modules/redis-client';
import { createCacheManager, CacheManager } from '../modules/cache-manager';

// Redis datastore connection
const cacheDb = new RedisClient('default', process.env.REDIS_URL);
cacheDb.init();

const htmlCache: CacheManager = createCacheManager(
  'default',
  'HTML-',
  cacheDb.client,
  Number(process.env.REDIS_TTL || 60)
);

const recentArticlesCache: CacheManager = createCacheManager(
  'default',
  'ARTICLES-RECENT-',
  cacheDb.client,
  Number(process.env.REDIS_TTL || 60)
);

export { htmlCache, recentArticlesCache };
