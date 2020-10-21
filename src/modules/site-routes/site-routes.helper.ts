import { SiteRoute } from '../../models/site-route.model';
import { logger } from '../../utils/logger';

export class SiteRoutesHelper {
  private getSiteRouteByPath = async (path: string, userId?: string) => {
     return await SiteRoute.findByPath(path);
 }

  public getByPath = async (path, useCached= true, saveCached= true) => {
    let siteRoute = await this.getSiteRouteByPath(path);

    if (siteRoute) {
      return siteRoute;
    } else {
      siteRoute = await this.getSiteRouteByPath(path + '/');
      if (siteRoute) {
        return siteRoute;
      } else {
        logger.error('Site Route not found:', path);
        throw new Error('getByPath: error');
      }
    }
  }
}
