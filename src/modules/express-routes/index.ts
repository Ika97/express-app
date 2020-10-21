import { logger } from '../../utils/logger';

export class ExpressRoutes {
  private options = { prefix: '', spacer: 6 };

  private spacer(x) {
    let spaces = this.options.spacer - x;
    let res = '';

    for (let i = spaces; i > 0; i--) {
      res += ' ';
    }
    return res;
  }

  // tslint:disable-next-line:member-ordering
  public list(routersArr) {
    let routesArr = [];

    routersArr.forEach((item) => {
      let path = item[0];
      let router = item[1];

      router.stack.forEach((stack) => {
        // is it middleware?
        if (stack.route) {
          let route = stack.route;
          let fullPath = path + route.path;
          let spacerChars;
          let method;

          route.stack.forEach((subStack) => {
            if (!method && subStack.method) {
              method = subStack.method.toUpperCase();
            }
          });

          spacerChars = this.spacer(method.length);

          routesArr.push({
            method: method.toUpperCase(),
            spaces: spacerChars,
            path: fullPath
          });
        }
      });
    });

    routesArr.forEach((r) => {
      logger.info(`${r.spaces}${r.method} ${r.path}`);
    });
  }
}

let expressRoutes = new ExpressRoutes();

export { expressRoutes };
