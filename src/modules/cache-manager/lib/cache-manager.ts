// tslint:disable:variable-name

export class CacheManager {
  private _prefix: string;
  private _cache: any;
  private _ttl: number;

  constructor(prefix: string, cache: any, ttl?: number) {
    this._prefix = prefix;
    this._cache = cache;
    this._ttl = ttl;
  }

  /**
   * Runs a GET command in the cache
   * @param id        A uuid for the record.  Will be concatinated with the prefix to become the string.
   * @returns         Object on success
   */
  public get = async (id) => {
    return new Promise((resolve, reject) => {
      this._cache.get(this._prefix + id, (error, res) => {
        if (error) {
          reject('Not Found');
        } else {
          resolve(JSON.parse(res));
        }
      });
    });
  }

  /**
   * Runs a SET command in the cache
   * @param id        A uuid for the record.  Will be concatinated with the prefix to become the string.
   * @param payload   And object that will be stringified as the data
   * @returns         'OK' on success
   */
  public set = async (id: string, payload: object) => {
    const cacheId = this._prefix + id;

    return new Promise((resolve, reject) => {
      this._cache.set(cacheId, JSON.stringify(payload), (error, res) => {
        // Set the item's time-to-live
        if (res === 'OK') {
          this._cache.expire(cacheId, this._ttl);
        }
        resolve(res);
      });
    });
  }

  /**
   * Runs a DEL command on the cache
   * @param id        The uuid of the record
   * @returns         'OK' on success
   */
  public delete = async (id) => {
    return new Promise((resolve, reject) => {
      this._cache.del(this._prefix + id, (error, res) => {
        resolve(res);
      });
    });
  }
}

// export type CacheManager = CacheManager;
