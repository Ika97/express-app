import { NextFunction, Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { SiteRoutesHelper } from './site-routes.helper';

const siteRoutesHelper = new SiteRoutesHelper();

export function attachSiteRoute() {
  return function(req: Request, res: Response, next: NextFunction) {
    logger.info('Path: ' + req.originalUrl);

    siteRoutesHelper.getByPath(req.originalUrl)
      .then((siteRoute) => {
      res.locals.page = siteRoute;
      next();
      })
      .catch((error) => {
        logger.error('No Site Route found: ' + req.originalUrl);
        next(error);
      });
  };
}
