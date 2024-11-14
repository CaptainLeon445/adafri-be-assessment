import express from 'express';
import rateLimit from 'express-rate-limit';
import { API_VERSION } from '../../constants/values.constants';

export class RateLimiterController {
  private resetAccesskeyLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 1,
    message: 'Too many requests to reset access key, please try again later',
  });

  constructor(private app: express.Application) {}

  public setupRateLimit() {
    this.app.use(API_VERSION + '/access/reset', this.resetAccesskeyLimiter);
  }
}
