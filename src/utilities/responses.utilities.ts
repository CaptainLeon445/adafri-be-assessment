import { Response } from 'express';
import Logs from '../models/logs.models';
import { ResponseObject } from '../types';

export const responseData = (statusCode: number, message: string, data?: Record<string, any>): ResponseObject => {
  return {
    statusCode, message, data
  }
}
export const sendResponse = async (res: Response, obj: ResponseObject) => {
  const { logResponse } = res.locals;
  const {statusCode, ...data}=obj
  const logDetails = {
    ...logResponse,
    response: {
      ...obj,
    },
  };
  await Logs.create(logDetails);
  let status: string = statusCode >= 200 && statusCode < 400 ? 'success' : 'fail'
  if (statusCode === 204) res.status(204).send();
  else res.status(statusCode).json({ status, ...data })
}