import { Router, Request, Response } from 'express';
import { attachPage } from '../modules/pages/pages.middleware';
import { populateAvailablePeople, attachHosts } from '../modules/people/people.middleware';
import { attachRecentArticles } from '../modules/articles/articles.middleware';

import {
  buildArticleSearchQuery,
  populateSearchPaginationVariables,
  searchArticles
} from '../modules/articles/articles.middleware';

export class SearchRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('',
      attachPage('search'),
      attachHosts(),
      attachRecentArticles(),
      buildArticleSearchQuery(),
      populateAvailablePeople(),
      searchArticles(),
      populateSearchPaginationVariables(),

      function(req: Request, res: Response) {
        res.locals.sortOptions = {
          'createdAt:desc': 'Date (recent)',
          'createdAt:asc': 'Date (oldest)'
        };

        res.locals.search = {
          title: 'Search Results - InvestorHour',
          availablePeople: res.locals.availablePeople,
          searchPerformed: res.locals.searchPerformed,
          results: res.locals.result.results,
          totalCount: res.locals.result.totalCount,
          query: res.locals.query,
          searchData: res.locals.searchData,
        };

        res.render('search', res.locals);
      }
    );
  }
}

const searchRouter = new SearchRouter();
export { searchRouter };
