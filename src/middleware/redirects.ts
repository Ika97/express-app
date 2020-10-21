import { NextFunction, Request, Response } from 'express';

/**
 * redirect away from all trailing slashes
 */
export const removeSlashes = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
      const query = req.url.slice(req.path.length);
      return res.redirect(302, req.path.slice(0, -1) + query);
    } else {
      next();
    }
  };
};
