import { NextFunction, Request, Response } from 'express';
import RequestIP from 'request-ip';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { FILE_EXTENSION } from '../constants/values.constants';
import { getErrorMessage } from '../middlewares/error_handlers/global-handler';
import { ERROR } from '../constants/errors.constants';
import geoip from 'geoip-lite';
import { toZonedTime } from 'date-fns-tz';
import { isDevelopmentEnv, isProductionEnv, isTestENV } from './guards';
import { ROLES } from '../models/enums';

// export const getCurrentIpAddress = (req: Request): string => {
//   const ipAddress =
//     req.header('x-forwarded-for').split(',').pop().trim() ||
//     RequestIP.getClientIp(req) ||
//     req.socket.remoteAddress;
//   return ipAddress;
// }

export const getUserAgentHeader = (req: Request) => req.headers['user-agent'];

export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const genReference = () => {
  const reference = uuidv4().slice(0, 12).split('-').join('');
  return reference;
};

export const formatDateToYearMonthDay = (dateValue: Date) => {
  const date = new Date(dateValue);
  const options: any = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
  if (formattedDate === 'Invalid Date') return null;
  return formattedDate;
};

export const renderTemplate = (
  res: Response,
  data: Record<string, any>,
  next: NextFunction
): Promise<string> => {
  return new Promise<string>((resolve) => {
    res.render(`${data.template}`, { data }, (err, html) => {
      if (err) {
        console.error('Error rendering template:', err);
        getErrorMessage(next, ERROR.serverError);
      } else {
        resolve(html);
      }
    });
  });
};

export const pagination = (req: Request): { offset: number; limit: number } => {
  const { offset = 1, limit = 50 } = req.query;

  let parsedPerPage: number = typeof limit === 'string' ? parseInt(limit) : (limit as number);
  if (isNaN(parsedPerPage)) {
    parsedPerPage = 50;
  }

  let parsedPage: number = typeof offset === 'string' ? parseInt(offset) : (offset as number);
  if (isNaN(parsedPage)) {
    parsedPage = 1;
  }
  const paginate = {
    offset: (parsedPage - 1) * parsedPerPage,
    limit: parsedPerPage,
  };
  return paginate;
};

export const getFileName = (filetype: string, filename: string): string | undefined => {
  if (filetype === 'pdf') return filename + '.' + FILE_EXTENSION.PDF;
};

export const removeWhiteSpace = (word: string): string | undefined => {
  if (!word) return;
  return word.replace(/\s+/g, '');
};

export const trimAndLowerCase = (word: string): string => {
  if (!word) return '';
  return word.trim().toLowerCase();
};

export const getPublicAddress = (req: Request): string => {
  const xForwardedFor = req.header('x-forwarded-for');
  const ip =
    (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
    RequestIP.getClientIp(req) ||
    req.ips[0] ||
    req.ip;
  if (!ip) return '';
  if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:')) {
    return 'localhost';
  }
  return ip;
};

export const convertHexToRgba = (hex: string, opacity: number) => {
  if (hex && opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
};

export const createImagesFolder = () => {
  const folderName: string = isTestENV ? 'local' : 'public';
  const folderPath = path.join(__dirname, `../../${folderName}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    const imagesFolderPath = path.join(folderPath, 'images');
    fs.mkdirSync(imagesFolderPath);
  }
};

export const currentTimestamp = (req: Request) => {
  const ip = req.ip || '0.0.0.0'; // Replace with a default IP if needed
  const geo = geoip.lookup(ip);
  const userTimezone = geo?.timezone || 'UTC';
  const utcDate = new Date(); // Current time in UTC
  const zonedDate = toZonedTime(utcDate, userTimezone);
  return zonedDate;
};

export const WEB_EVENTS_URL =
  isProductionEnv || isDevelopmentEnv
    ? process.env.WEB_EVENT_URL
    : 'http://127.0.0.1:4000/webevents/notification';
export const BASE_URL = isProductionEnv ? process.env.SERVER_PROD_URL : process.env.SERVER_DEV_URL;

export const LOCALHOST = `http:127.0.0.1:${process.env.PORT || 8752}`;
export const GOOGLE_API_BASE_URL = 'https://www.googleapis.com';
export const GOOGLE_ACCOUNT_BASE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export const ROLES_ARRAY = Object.values(ROLES);

export const getUpdatedFields = <T extends object>(
  existingData: T,
  updatedData: Partial<T>
): Partial<T> =>
  Object.fromEntries(
    Object.entries(updatedData).filter(([key, value]) => existingData[key as keyof T] !== value)
  ) as Partial<T>;
