import { Router, Request, Response, NextFunction } from 'express';
import { setDefaultLocals } from '../modules/shared/shared.middleware';
import { logger } from '../utils/logger';

export class ErrorRouter  {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.use(
      setDefaultLocals(),
    );

    // CATCH ALL 404
    this.router.use(function(req: Request, res: Response, next: NextFunction) {
      res.locals.page = {
        meta: {
          title: '404 Not Found',
          description: null,
          keywords: null,
          featuredImage: null
        }
      };

      res.status(404);
      res.render('not-found', res.locals);
    });

    // CATCH ALL ERROR HANDLER
    this.router.use(function(error, req: Request, res: Response, next: NextFunction) {
      res.locals.page = {
        meta: {
          title: '404 Not Found',
          description: null,
          keywords: null,
          featuredImage: null
        }
      };
      res.locals.error = error.code;
      logger.error(error);

      res.status(404);
      res.render('not-found', res.locals);
    });
  }
}

const errorRouter = new ErrorRouter();
export { errorRouter };
