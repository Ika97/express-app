import { CacheManager } from './lib/cache-manager';
/**
 * Contains an object of cacheManagers.  Used for caching of cacheManager instances.
 */
const cacheManagers = {};

/**
 * Helper funtion that when passed a name will pull that cacheManager from the cache
 * @param name  The name used for reference for the cacheManager
 * @returns     CacheManager instance
 */
function cacheManager(name?): CacheManager {
    return name ? cacheManagers[name] : cacheManagers['default'];
}

/**
 * @param name      A name used to reference the cacheManager
 * @param prefix    Prefix to use within the cacheManager (i.e. ``SESSION-`` or ``USER-``)
 * @param dataStore The name used for reference for the cacheManager
 * @param ttl
 * @returns         CacheManager instance.
 */
const createCacheManager = (
  name: string,
  prefix: string,
  dataStore: object,
  ttl: number
): CacheManager => {
  if (name && prefix && dataStore) {
      return cacheManagers[name] = new CacheManager(prefix, dataStore, ttl);
  } else {
      throw new Error('CACHE ERROR');
  }
};

export { CacheManager, cacheManager, createCacheManager };
