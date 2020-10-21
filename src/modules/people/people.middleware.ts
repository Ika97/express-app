import { NextFunction, Request, Response } from 'express';
import { IPersonDocument, IPersonQuery } from '../../interfaces/person';
import { PeopleHelper } from './people.helper';
import { logger } from '../../utils/logger';
import { ArticlesHelper } from '../articles/articles.helper';
import querystring = require('querystring');

const peopleHelper = PeopleHelper.getInstance();
const articlesHelper = ArticlesHelper.getInstance();

export function attachHosts() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (res.locals.page.displayHosts) {
      peopleHelper.getPeopleByRole('host')
        .then((hosts: IPersonDocument[]) => {
          res.locals.hosts = res.locals.hosts.concat(hosts);
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next();
    }
  };
}

export function attachGuests() {
  return function(req: Request, res: Response, next: NextFunction) {
    peopleHelper.getPeopleByRole('guest')
    .then((guests: IPersonDocument[]) => {
      res.locals.guests = guests;
      next();
    })
    .catch((err) => {
      next('Not found');
    });
  };
}

export function searchPeople() {
  return function(req: Request, res: Response, next: NextFunction) {
    peopleHelper.search(res.locals.query)
      .then((result) => {
        res.locals.result = result;
        next();
      })
      .catch((error) => {
        next('Not found');
      });
  };
}

export function attachPerson() {
  return function(req: Request, res: Response, next: NextFunction) {
    let code = req.url;
    if (code[0] === '/') {
      code = code.slice(1);
    }
    if (code[code.length] === '/') {
      code = code.slice(-1);
    }

    peopleHelper.getPersonByCode(code)
      .then((person) => {
        res.locals.person = person;
        next();
      })
      .catch((err) => {
        logger.error(err);
        next(err);
      });
  };
}

export function attachFeaturedEpisodes() {
  return function(req: Request, res: Response, next: NextFunction) {
    articlesHelper.getFeaturedEpisodes(res.locals.person.code)
      .then((episodes) => {
        if (episodes.length === 0) {
          next();
        } else {
          let peopleSetsPromises = [];
          let featuringEpisodes;
          res.locals.options.articles.featuring = res.locals.options.articles.featuring.concat(episodes);

          featuringEpisodes = res.locals.options.articles.featuring;
          featuringEpisodes.map((article) => {
            if (article.people && article.people.length > 0) {
              let promise = peopleHelper.getPeopleByCodes(article.people);
              peopleSetsPromises.push(promise);
            }
          });
          Promise.all(peopleSetsPromises).then((values) => {
            values.forEach((value, index) => {
              if (featuringEpisodes[index].people && featuringEpisodes[index].people.length > 0) {
                featuringEpisodes[index].featuring = value;
              }
            });
            next();
          });
        }
      });
  };
}

export function attachLatestFeatured() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (res.locals.options.articles.featuring.length > 0) {
      res.locals.lastFeatured = res.locals.options.articles.featuring.sort((f1, f2) => {
        return f2.createdAtMoment - f1.createdAtMoment;
      })[0];
    }

    next();
  };
}

export function populateAvailablePeople() {
  return function(req: Request, res: Response, next: NextFunction) {
    articlesHelper.getAvailablePeopleCodes()
      .then(peopleHelper.getPeopleByCodes)
      .then((people: object[]) => {
        res.locals.availablePeople = people;
        next();
      })
      .catch((error) => {
        logger.error('Something went wrong');
        next(error);
      });
  };
}

export function buildPeopleSearchQuery(role) {
  return function(req: Request, res: Response, next: NextFunction) {
    let page = req.query.page !== undefined ? parseInt(req.query.page) : 1;
    // let dateFormat = 'MM/DD/YYYY';

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    let query: IPersonQuery = {
      limit: 10,
      page: page,
      role: role,
      haveCriteria: false,
    };

    if (req.query.order !== undefined) {
      query.order = req.query.order;
    }

    res.locals.query = query;
    next();
  };
}

export function populatePeoplePaginationVariables() {
  return function(req: Request, res: Response, next: NextFunction) {
    let searchData = {
      totalPages: 0,
      currentPage: 0,
      baseUrl: '',
    };

    searchData.totalPages = Math.ceil(res.locals.result.totalCount / res.locals.query.limit);
    searchData.currentPage = res.locals.query.page;

    let parsedQuery = Object.assign({}, req.query);
    parsedQuery['page'] = '___PAGE___';

    searchData.baseUrl = '/guests?' + querystring.stringify(parsedQuery);

    res.locals.searchData = searchData;

    next();
  };
}
