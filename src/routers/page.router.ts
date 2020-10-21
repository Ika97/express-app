import { Router } from 'express';
import { attachRecentArticles } from '../modules/articles/articles.middleware';
import { attachHosts } from '../modules/people/people.middleware';
import { attachPage, renderPage, pageError } from '../modules/pages/pages.middleware';
import { saveCachedHtml, setActiveNav } from '../modules/shared/shared.middleware';

export class PageRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.use(
      attachRecentArticles(10),
    );

    this.router.get('',
      attachPage('home'),
      setActiveNav('home'),
      pageError(),
      attachHosts(),
      saveCachedHtml('home'),
      renderPage('home')
    );

    this.router.get('/about',
      attachPage('about'),
      setActiveNav('about'),
      pageError(),
      saveCachedHtml('page'),
      renderPage('page')
    );

    this.router.get('/frequently-asked-questions',
      attachPage('frequently-asked-questions'),
      attachHosts(),
      pageError(),
      saveCachedHtml('page'),
      renderPage('page')
    );

    this.router.get('/contact',
      attachPage('contact'),
      attachHosts(),
      setActiveNav('contact'),
      pageError(),
      saveCachedHtml('page'),
      renderPage('page')
    );

    this.router.get('/privacy-policy',
      attachPage('privacy-policy'),
      attachHosts(),
      pageError(),
      saveCachedHtml('page'),
      renderPage('page')
    );

    this.router.get('/disclaimer',
      attachPage('disclaimer'),
      attachHosts(),
      pageError(),
      saveCachedHtml('page'),
      renderPage('page')
    );

    this.router.get('/legal-notices',
      attachPage('legal-notices'),
      attachHosts(),
      pageError(),
      saveCachedHtml('page'),
      renderPage('page')
    );
  }
}

const pageRouter = new PageRouter();
export { pageRouter };
