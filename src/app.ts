import * as bluebird from 'bluebird';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as path from 'path';
import * as environment from './config/environment';
import { expressRoutes } from './modules/express-routes';
import { /*renderCachedPage,*/ setDefaultLocals } from './modules/shared/shared.middleware';
import * as routers from './routers';
import { logger } from './utils/logger';
import { ConfigurationRegistry } from './config/configuration-registry';
import { removeSlashes } from './middleware/redirects';

// initialize configuration
environment.init();

// create the necessary constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const baseUrl = ConfigurationRegistry.getInstance().getBaseUrl();
const mongoUrl = process.env.MONGO_URL || '';

// create the express application
const app = express();

mongoose.connect(mongoUrl, { useNewUrlParser: true, promiseLibrary: bluebird }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch((error) => {
  logger.error('MongoDB connection error. Please make sure MongoDB is running. ', error);
  process.exit(1);
});

// set the view engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// configure express middleware (ORDER MATTERS!!!)
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(setDefaultLocals());
app.use(removeSlashes());
// app.use(renderCachedPage());

// set static assets route
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// set express routes
app.use('/episodes', routers.articlesRouter.router);
app.use('/search', routers.searchRouter.router);
app.use('/rss', routers.rssRouter.router);
app.use('/guests', routers.peopleRouter.router);
app.use('/sitemap.xml', routers.sitemapRouter.router);
app.use('', routers.pageRouter.router);

// set error handler
app.use('', routers.errorRouter.router);

// display all routes
if (!isProduction) {
  expressRoutes.list([
    ['/episodes', routers.articlesRouter.router],
    ['/search', routers.searchRouter.router],
    ['/rss', routers.rssRouter.router],
    ['/person', routers.peopleRouter.router],
    ['', routers.pageRouter.router],
    ['', routers.errorRouter.router]
  ]);
}

// start app
app.listen(port, () => {
  logger.info('App is running at '.concat(baseUrl, ' in ', app.get('env'), ' mode'));
  logger.info('Press CTRL-C to stop');
});

export { app };
