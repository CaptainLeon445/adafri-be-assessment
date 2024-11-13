import { Response } from 'express';
import { AppError } from '../middlewares/error_handlers/app-error';
import { ERROR } from '../constants/errors.constants';

export class ErrorHandler {
  public static prodErrorHandler(err: any, res: Response) {
    return res.status(err.statusCode).json({
      status: 'error',
      error: err.message,
    });
  }
  public static devErrorHandler(err: any, res: Response) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  public static handleValidationError(err: any) {
    const errors = err.message.errors.map((err: any) => ({
      message: err.message.replace(/['"\\]/g, ''),
    }));
    return new AppError(errors, 400);
  }

  public static handleDatabaseError(err: any) {
    let errorMsg: string;

    const pattern = /invalid input value for enum enum_users_role/;

    if (pattern.test(err.message)) errorMsg = 'Invalid role input';
    else errorMsg = err.message;
    return new AppError(errorMsg, 400);
  }

  public static async handleForeignKeyConstraintError(err: any) {
    const error: string = err.message;
    return new AppError(error, 400);
  }
  public static handleInternalServerError() {
    const error: [string, number] = ERROR.serverError;
    return new AppError(error[0], error[1]);
  }

  public static async handleFoError(err: any) {
    const error: string = err.message;
    return new AppError(error, 400);
  }

  public static async handleTokenExpiredError() {
    return new AppError('Token Expired', 401);
  }
  public static async RateLimitExceeded(err: any, res: Response) {
    const remainingAttempt = err.retryAfter;
    return res.status(ERROR.rateLimitExceeded[1]).json({
      message: ERROR.rateLimitExceeded[0],
      remainingAttempt,
    });
  }
}