import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment';
import { IArticleQuery } from '../../interfaces/article';

export const buildArchiveQuery = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dateFormat = 'MM/DD/YYYY';
    let page = req.query.page !== undefined ? parseInt(req.query.page) : 1;

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    let query: IArticleQuery = { limit: 20, page: page, haveCriteria: true };

    if (req.query.from !== undefined && req.query.from.length > 0) {
      let from = moment(req.query.from, dateFormat);

      if (from.isValid()) {
        from.startOf('day');
        query.dateFrom = from;
      }
    }

    if (req.query.to !== undefined && req.query.to.length > 0) {
      let to = moment(req.query.to, dateFormat);

      if (to.isValid()) {
        to.endOf('day');
        query.dateTo = to;
      }
    }

    query.categories = ['episode'];

    res.locals.query = query;
    next();
  };
};

export const populateArchiveData = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.page.meta.title = 'Episodes Archive - Investor Hour';
    res.locals.archive = {
      searchPerformed: res.locals.searchPerformed,
      results: res.locals.result.results,
      totalCount: res.locals.result.totalCount,
      query: res.locals.query,
      searchData: res.locals.searchData,
    };
    next();
  };
};
