import { NextFunction, Request, Response, Router } from 'express';
import { buildArchiveQuery, populateArchiveData } from '../modules/archive/archive.middleware';
import {
  attachArticle, attachNextEpisode, populateSearchPaginationVariables, searchArticles
} from '../modules/articles/articles.middleware';
import { attachPage, renderPage } from '../modules/pages/pages.middleware';
import { attachHosts } from '../modules/people/people.middleware';
import { saveCachedHtml, setActiveNav } from '../modules/shared/shared.middleware';
import { attachSiteRoute } from '../modules/site-routes/site-routes.middleware';
import { logger } from '../utils/logger';

export class ArticlesRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('',
      attachPage('episodes'),
      setActiveNav('episodes'),
      buildArchiveQuery(),
      searchArticles(),
      populateSearchPaginationVariables(),
      populateArchiveData(),
      attachHosts(),
      renderPage('episodes')
    );

    this.router.get('/:slug',
      attachSiteRoute(),
      attachArticle(),
      attachNextEpisode(),
      attachHosts(),
      saveCachedHtml('article'),
      renderPage('article')
    );

    this.router.use(
      function(error: Error, req: Request, res: Response, next: NextFunction) {
        logger.error(error);
        next();
      }
    );
  }
}

const articlesRouter = new ArticlesRouter();
export { articlesRouter };
