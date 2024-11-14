import { Application, Request, Response } from 'express';
import logger from '../utilities/logger';
import { captureAppDetails } from '../middlewares/utils/utils.middleware';
import campaignRoutes from './campaign.routes';
import { API_VERSION } from '../constants/values.constants';
import { authProtect } from '../middlewares/auth/auth.middleware';
import accessKeyRouter from './access-keys';

export const indexRoutes = (app: Application) => {
  app.use(captureAppDetails);
  app.use(API_VERSION + '/campaigns', authProtect, campaignRoutes);
  app.use(API_VERSION + '/access', accessKeyRouter);
  app.use(API_VERSION + '/health', (req: Request, res: Response) => {
    const data = res.locals;
    return res.status(200).json({
      status: 'successs',
      message: 'adafri campaign application running successfully',
      data,
    });
  });
  app.all('*', (req: Request, res: Response) => {
    logger.error(`Can't find ${req.originalUrl} on the server`);
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on the server`,
    });
  });
};
