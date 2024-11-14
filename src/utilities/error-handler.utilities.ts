import { Response } from 'express';
import { AppError } from '../middlewares/error_handlers/app-error';
import { StatusCodes } from 'http-status-codes';

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
    return new AppError("An unknown error occured", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public static async handleFoError(err: any) {
    const error: string = err.message;
    return new AppError(error, 400);
  }

  public static async handleCelebrateError(err){
    let message;
    if (err.details.get('params')) {
      message = err.details
        .get('params')
        ?.details[0].message.replace(/"+/g, '');
    }
    return new AppError(message, StatusCodes.BAD_REQUEST)
  }

  public static async handleTokenExpiredError() {
    return new AppError('Token Expired', 401);
  }
}
