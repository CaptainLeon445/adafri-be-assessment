import { Response } from 'express';

export const postResponse = async (res: Response, message: string, data?: Record<string, any>) => {
  // const { logResponse } = res.locals;
  if (data) delete data.password;
  // const logDetails = {
  //   ...logResponse,
  //   response: {
  //     ...data,
  //   },
  // };
  // await Logs.create(logDetails);
  return res.status(201).json({
    status: 'success',
    message,
    data,
  });
};

export const getResponse = async (
  res: Response,
  message: string,
  data?: Record<string, any> | string,
  count?: number,
  pages?: number
) => {
  // const { logResponse } = res.locals;
  const responseData = {
    status: 'success',
    message,
  };
  count && (responseData['count'] = count);
  pages && (responseData['pages'] = pages);
  data && (responseData['data'] = data);
  // const logDetails = {
  //   ...logResponse,
  //   response: {
  //     ...responseData,
  //   },
  // };
  // await Logs.create(logDetails);
  return res.status(200).json(responseData);
};

export const deleteResponse = async (res: Response) => {
  // const { logResponse } = res.locals;
  // const logDetails = {
  //   ...logResponse,
  // };
  // await Logs.create(logDetails);
  return res.status(204).end();
};

export const serverErrorResponse = (res: Response, message: string) => {
  return res.status(500).json({ status: 'error', message });
};
