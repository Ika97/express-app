import { NextFunction, Request, Response } from 'express';
import { PagesHelper } from './pages.helper';
import { logger } from '../../utils/logger';
import { IPageDocument } from '../../interfaces/page';
import { isAppError } from '../../utils/misc';

const pagesHelper = new PagesHelper();

export function attachPage(id) {
  return function(req: Request, res: Response, next: NextFunction) {
    logger.info('Path: ' + req.originalUrl);

    pagesHelper.getByWordpressId(id)
      .then((page: IPageDocument) => {
        res.locals.page = Object.assign(res.locals.page, page.toObject());
        res.locals.page.meta = page.seo;
        next();
      })
      .catch((error) => {
        logger.error(error);
        next(error);
      });
  };
}

export function pageError() {
  return function(err: Error, req: Request, res: Response, next: NextFunction) {
    if (isAppError(err)) {
      next();
    } else {
      next(err);
    }
  };
}

export function renderPage(layout) {
  return function(req: Request, res: Response, next: NextFunction) {
    res.render(layout, res.locals);
  };
}
