import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { AppError } from './app-error';
import { ErrorHandler } from '../../utilities/error-handler.utilities';
import { ERROR } from '../../constants/errors.constants';
import logger from '../../utilities/logger';
export class GlobalErrorHandler {
  static async handleError(
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ): Promise<any> {
    const appError = err as AppError;
    const stack = appError.stack;
    appError.statusCode = appError.statusCode || 500;
    appError.message = appError.message || ERROR.serverError[0];
    let error: any = { ...appError };

    if (appError.statusCode === 500) error = ErrorHandler.handleInternalServerError();
    if (appError.name === 'SequelizeValidationError')
      error = ErrorHandler.handleValidationError(error);
    if (appError.name === 'SequelizeDatabaseError')
      error = ErrorHandler.handleDatabaseError(appError);
    if (appError.name === 'SequelizeForeignKeyConstraintError')
      error = ErrorHandler.handleForeignKeyConstraintError(appError);
    if (appError.name === 'TokenExpiredError') error = ErrorHandler.handleTokenExpiredError();

    error = { ...error, stack };

    if (!res.headersSent) {
      ErrorHandler.devErrorHandler(error, res);
    }

    process.nextTick(async () => {
      const { logResponse } = res.locals;
      const logDetails = {
        ...logResponse,
        response: {
          statusCode: error.statusCode,
          status: error.status,
          message: error.message,
          stack: error.stack,
        },
      };

      try {
        // await Logs.create(logDetails);
        logger.error(logDetails);
      } catch (logError) {
        Sentry.captureException(logError);
      }
    });

    Sentry.captureException(error.stack);
  }
}

export const getErrorMessage = (next: NextFunction, error: [string, number]) => {
  return next(new AppError(error[0], error[1]));
};
