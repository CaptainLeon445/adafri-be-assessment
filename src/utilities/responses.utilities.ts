import { Response } from 'express';
import Logs from '../models/logs.models';
import { ResponseObject } from '../types';

export const responseData = (statusCode: number, message: string, data?: Record<string, any>): ResponseObject => {
  return {
    statusCode, message, data
  }
}
export const sendResponse = async (res: Response, data: ResponseObject) => {
  const { logResponse } = res.locals;
  const logDetails = {
    ...logResponse,
    response: {
      ...data.data,
    },
  };
  console.log(logDetails)
  await Logs.create(logDetails);
  let status: string = data.statusCode >= 200 && data.statusCode < 400 ? 'success' : 'fail'
  if (data.statusCode === 204) res.status(204).send();
  else res.status(data.statusCode).json({ status, message: data.message, data })
}