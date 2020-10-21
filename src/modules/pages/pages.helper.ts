import { Page } from '../../models/page.model';
import { logger } from '../../utils/logger';

export class PagesHelper {
  public getByWordpressId = async (id) => {
    let page = await Page.findBySlug(id);

    if (page) {
      return page;
    } else {
      const message = 'Page not found: '.concat(id);
      logger.error(message);
      throw new Error(message);
    }
  }
}
