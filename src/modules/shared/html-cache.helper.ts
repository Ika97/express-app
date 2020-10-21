import { htmlCache } from '../../config/datastores';
import { logger } from '../../utils/logger';

export class HtmlCacheHelper {

  private getCached = async (id) => {
    return await htmlCache.get(id);
  }

  private setCached = async (id, payload) => {
    return await htmlCache.set(id, payload);
  }

  public getCachedHtmlByPath = async (path) => {
    let htmlCacheItem = await this.getCached(path);

    if (htmlCacheItem) {
      logger.info('Cache: used html item');
      return htmlCacheItem;
    } else {
      return;
    }
  }

  public saveCachedHtmlByPath = async (path, payload) => {
    let htmlCacheItem = await this.setCached(path, payload);

    if (htmlCacheItem) {
      logger.info('Cache: saved html item');
      return;
    } else {
      return;
    }
  }
}

export const htmlCacheHelper = new HtmlCacheHelper();
