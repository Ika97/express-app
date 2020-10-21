import { Router, Request, Response } from 'express';

import { attachRssFeed } from '../modules/articles/articles.middleware';

export class RssRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('',
      attachRssFeed(),
      function(req: Request, res: Response) {
        res.set('content-type', 'text/xml');
        res.render('rss', {
          title: 'RSS',
          rss: res.locals.feed
        });
      }
    );
  }
}

const rssRouter = new RssRouter();
export { rssRouter };
