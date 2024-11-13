import { Application, Request, Response } from 'express';
import RequestIP from 'request-ip';
import { format } from 'date-fns';
import logger from '../utilities/logger';
import {
  captureAppDetails,
} from '../middlewares/utils/utils.middleware';
import { currentTimestamp } from '../utilities/global.utilities';

export const indexRoutes = (app: Application) => {
  app.use(captureAppDetails);

  app.use('/api/v1/health', (req, res) => {
    const zonedDate = currentTimestamp(req);
    // Format the time in the desired format
    const fUserTime = format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX');
    const deviceDetails = {
      forwarded: req.header('x-forwarded-for'),
      forwarded1: req.headers['x-forwarded-for'],
      forwarded2: req.ips[0],
      forwarded3: req.ip,
      module: RequestIP.getClientIp(req),
      device: req.headers['user-agent'],
      fUserTime,
      zonedDate,
    };
    return res.status(200).json({
      status: 'successs',
      message: 'auth application running successfully',
      data: deviceDetails,
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
