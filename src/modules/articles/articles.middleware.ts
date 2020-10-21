import { NextFunction, Request, Response } from 'express';
import * as RSS from 'rss';
import { ConfigurationRegistry } from '../../config/configuration-registry';
import { siteUrl } from '../../utils/url.helper';
import { IArticleDocument, IArticleQuery } from '../../interfaces/article';
import { logger } from '../../utils/logger';
import { DESCRIPTION } from '../../utils/misc';
import { ArticlesHelper } from './articles.helper';
import moment = require('moment');
import querystring = require('querystring');
import { PeopleHelper } from '../people/people.helper';

const articlesHelper = ArticlesHelper.getInstance();
const peopleHelper = new PeopleHelper();

export function attachRecentArticles(count = 10) {
  return function(req: Request, res: Response, next: NextFunction) {
    articlesHelper.getRecentList(count).then((articles) => {
      let peopleSetsPromises = [];
      let recentArticles;
      res.locals.options.articles.recent = res.locals.options.articles.recent.concat(articles);

      recentArticles = res.locals.options.articles.recent;
      peopleSetsPromises = recentArticles.map((article) => {
        if (article.people && article.people.length > 0) {
          return peopleHelper.getPeopleByCodes(article.people).catch((err) => logger.info(err));
        }
      });
      Promise.all(peopleSetsPromises).then((values) => {
        values.forEach((value, index) => {
          if (recentArticles[index].people && recentArticles[index].people.length > 0) {
            recentArticles[index].featuring = value;
          }
        });
        next();
      });
    }).catch((err) => {
      logger.error('Failed to get recent articles list: ', err);
      next(err);
    });
  };
}

export function attachArticle() {
  return function(req: Request, res: Response, next: NextFunction) {
    let wordpressId = res.locals.page.wordpressId;

    articlesHelper.getByWordpressId(wordpressId)
      .then((article) => {
        if (!article) {
          return next(new Error('Article not found'));
        }
        res.locals.page.article = article;
        next();
      })
      .catch((error) => {
        logger.error(error);
        next(error);
      });
  };
}

export function attachNextEpisode() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (res.locals.page.article.episodeNumber) {
      let currentEpisodeNumber = res.locals.page.article.episodeNumber;

      articlesHelper.getNextEpisode(currentEpisodeNumber)
        .then((article) => {
          if (!article) {
            res.locals.page.nextEpisode = null;
            next();
            return;
          }

          res.locals.page.nextEpisode = article;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      res.locals.page.nextEpisode = null;
      next();
    }
  };
}

export function attachArticles() {
  return function(req: Request, res: Response, next: NextFunction) {
    articlesHelper.getRecentList()
      .then((articles) => {
        res.locals.options.articles.recent = res.locals.options.articles.recent.concat(articles);
        next();
      })
      .catch((error) => {
        logger.error('No Recent Articles found');
        next(error);
      })
    ;
  };
}

export function attachRssFeed() {
  return function(req: Request, res: Response, next: NextFunction) {
    let baseUrl = ConfigurationRegistry.getInstance().getBaseUrl();
    let feed = new RSS({
      title: 'Stansberry Investor Hour',
      site_url: baseUrl,
      description: DESCRIPTION,
      feed_url: siteUrl('/rss')
    });

    articlesHelper.getRecentList()
      .then((articles) => {
        articles.forEach((article: IArticleDocument) => {
          feed.item({
            title: article.title,
            description: article.excerpt,
            guid: String(article.wordpressId),
            date: article.createdAt,
            url: baseUrl + '/episodes/' + article.slug + '/'
          });
        });

        res.locals.feed = feed.xml();
        next();
      })
      .catch((error) => {
        logger.error('RSS Feed Error');
        next(error);
      });
  };
}

export function buildArticleSearchQuery() {
  return function(req: Request, res: Response, next: NextFunction) {
    let page = req.query.page !== undefined ? parseInt(req.query.page) : 1;
    let dateFormat = 'MM/DD/YYYY';

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    let query: IArticleQuery = {
      limit: 20,
      page: page,
      haveCriteria: false,
    };

    if (req.query.keywords !== undefined && req.query.keywords.length > 0) {
      query.keywords = req.query.keywords;
      query.haveCriteria = true;
    }

    if (req.query.person !== undefined && req.query.person.length > 0) {
      query.person = req.query.person;
      query.haveCriteria = true;
    }

    if (req.query.dateFrom !== undefined && req.query.dateFrom.length > 0) {
      let dateFrom = moment(req.query.dateFrom, dateFormat);

      if (dateFrom.isValid()) {
        dateFrom.startOf('day');
        query.dateFrom = dateFrom;
        query.haveCriteria = true;
      }
    }

    if (req.query.dateTo !== undefined && req.query.dateTo.length > 0) {
      let dateTo = moment(req.query.dateTo, dateFormat);

      if (dateTo.isValid()) {
        dateTo.endOf('day');
        query.dateTo = dateTo;
        query.haveCriteria = true;
      }
    }

    if (req.query.order !== undefined) {
      query.order = req.query.order;
    }

    res.locals.query = query;
    next();
  };
}

export function searchArticles() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.query.haveCriteria) {
      res.locals.result = {
        totalCount: 0,
        results: []
      };
      next();
    } else {
      articlesHelper.search(res.locals.query)
        .then((result) => {
          res.locals.result = result;
          next();
        })
        .catch((error) => {
          logger.error('No episodes found for query: ' + res.locals.query);
          next(error);
        });
    }
  };
}

export function populateSearchPaginationVariables() {
  return function(req: Request, res: Response, next: NextFunction) {
    let searchData = {
      totalPages: 0,
      currentPage: 0,
      baseUrl: '',
    };

    if (!res.locals.query.haveCriteria) {
      searchData.totalPages = 0;
      searchData.currentPage = 0;
    } else {
      searchData.totalPages = Math.ceil(res.locals.result.totalCount / res.locals.query.limit);
      searchData.currentPage = res.locals.query.page;

      let parsedQuery = Object.assign({}, req.query);
      parsedQuery['page'] = '___PAGE___';

      searchData.baseUrl = req.baseUrl.concat('?', querystring.stringify(parsedQuery));
    }

    res.locals.searchData = searchData;

    next();
  };
}
