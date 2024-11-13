import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-console
  console.log('using environment variables from server environment');
  dotenv.config();
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: 'dev.env', debug: true });
} else {
  console.log(process.env.NODE_ENV);
  dotenv.config({ path: `${process.env.NODE_ENV}.env`, debug: true });
}
import express, { Application, NextFunction, Request, Response } from 'express';
const app: Application = express();


import morgan from 'morgan';
import xss from 'xss';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import { RateLimiterController } from './middlewares/rate_limiter/rate-limiter.middleware';
import { GlobalErrorHandler } from './middlewares/error_handlers/global-handler';
import { indexRoutes } from './routes/index.routes';
import { isProductionEnv, isTestENV } from './utilities/guards';

console.log('============WELCOME!!!====================');
console.log(`App server is in ${process.env.NODE_ENV} mode`);
console.log('==========================================');



app.use(helmet());

if (isProductionEnv) {
  const rateLimitedController = new RateLimiterController(app);
  rateLimitedController.setupRateLimit();
}

app.use(express.json());



app.use((req, res, next) => {
  res.locals.xss = xss;
  next();
});

app.use(hpp());

app.use(compression());

app.disable('x-powered-by');

app.set('trust proxy', !isTestENV);

app.use(morgan('dev'));

app.use((req: Request, res: Response, next) => {
  console.log('Using digit-tally middlewares API. 💻');
  next();
});

app.get('/api-docs', (req, res) => {
  res.redirect(process.env.API_DOCS);
});

indexRoutes(app);


app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  await GlobalErrorHandler.handleError(err, req, res, next);
});

export default app;
