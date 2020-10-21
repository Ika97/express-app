import * as ejs from 'ejs';
import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import { htmlCacheHelper } from './html-cache.helper';

export function setDefaultLocals() {
  return function(req: Request, res: Response, next: NextFunction) {
    res.locals = {
      options: {
        layout: 'page',
        activeNav: '',
        sidebar: 'basic',
        articles: {
          recent: [],
          trending: [],
          featuring: []
        }
      },
      page: {},
      hosts: [],
      person: null,
      shouldCachePage: false,
      lastFeatured: null
    };
    next();
  };
}

export function setActiveNav(activeNav) {
  return function(req: Request, res: Response, next: NextFunction) {
    res.locals.options.activeNav = activeNav;
    next();
  };
}

export function saveCachedHtml(page) {
  const pagePath = path.resolve(__dirname) + '/../../views/' + page + '.ejs';

  return function(req: Request, res: Response, next: NextFunction) {
    // Should we cache the html
    if (res.locals.shouldCachePage) {
      ejs.renderFile(pagePath, res.locals, function(error, compiledHtml) {
        if (error) {
          next();
        } else {
          htmlCacheHelper.saveCachedHtmlByPath(req.baseUrl + req.path, compiledHtml)
            .then(() => {
              res.send(compiledHtml).end();
            })
            .catch((err) => {
              next(err);
            })
          ;
        }
      });
    } else {
      // just continue without using cache
      next();
    }
  };
}

export function renderCachedPage() {
  return function(req: Request, res: Response, next: NextFunction) {
    htmlCacheHelper.getCachedHtmlByPath(req.path)
    .then((cachedPage) => {
      if (cachedPage) {
        res.send(cachedPage);
      } else {
        res.locals.shouldCachePage = true;
        next();
      }
    })
    .catch((error) => {
      next(error);
    });
  };
}
