import { Router, Request, Response, NextFunction } from 'express';
import { Article } from '../models/article.model';
import * as moment from 'moment';

function attachSitemapArticles() {
  return function(req: Request, res: Response, next: NextFunction) {
    Article.find({})
    .select('slug updatedAt')
    .sort({createdAt: -1})
    .exec()
    .then((articles) => {
      res.locals.articles = articles;
      next();
    });
  };
}

export class SitemapRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.router.get('',
      attachSitemapArticles(),
      function(req: Request, res: Response) {
        let sitemapXml = '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9/">';
        res.locals.articles.forEach((article) => {
          sitemapXml.concat('<url><loc>http://investorhour.com/episodes/');
          sitemapXml.concat(`${article.slug}`);
          sitemapXml.concat('/</loc><lastmod>');
          sitemapXml.concat(`${moment(article.updatedAt).format('YYYY-MM-DD')}`);
          sitemapXml.concat('</lastmod></url>');
        });
        sitemapXml.concat('</urlset>');
        res.set('content-type', 'text/xml');
        res.send(sitemapXml);
      }
    );
  }
}

const sitemapRouter = new SitemapRouter();
export { sitemapRouter };
