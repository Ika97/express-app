import { NextFunction, Request, Response, Router } from 'express';
import { attachPage, renderPage } from '../modules/pages/pages.middleware';
import {
  attachFeaturedEpisodes,
  attachHosts,
  attachLatestFeatured,
  attachPerson,
  buildPeopleSearchQuery,
  populatePeoplePaginationVariables,
  searchPeople
} from '../modules/people/people.middleware';
import { saveCachedHtml, setActiveNav } from '../modules/shared/shared.middleware';
import { logger } from '../utils/logger';

export class PeopleRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/',
      attachPage('guests'),
      buildPeopleSearchQuery('guest'),
      searchPeople(),
      populatePeoplePaginationVariables(),
      setActiveNav('guests'),
      attachHosts(),
      saveCachedHtml('guests'),

      function(req: Request, res: Response) {
        res.locals.sortOptions = {
          'createdAt': 'Most Recent Guests',
          'name': 'Alphabetical (A-Z)'
        };

        res.locals.search = {
          results: res.locals.result.results,
          totalCount: res.locals.result.totalCount,
          query: res.locals.query,
          searchData: res.locals.searchData,
        };

        res.render('guests', res.locals);
      }
    );

    this.router.get('/*',
      attachPerson(),
      saveCachedHtml('person'),
      attachFeaturedEpisodes(),
      attachLatestFeatured(),
      renderPage('person')
    );

    this.router.use(
      function(err, req: Request, res: Response, next: NextFunction) {
        logger.error(err, req.url);
        next();
      }
    );
  }
}

const peopleRouter = new PeopleRouter();
export { peopleRouter };
